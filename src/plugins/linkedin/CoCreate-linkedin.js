'use strict'
const utils = require('../utils');
const LinkedInRestClient = require("./LinkedInRestClient");

const LINKEDIN_CLIENT_ID = '78mawgifvkfkk1';
const LINKEDIN_CLIENT_SECRET = 'Yz1UXE9fQRgHFST2';
const CALL_BACK_URL = 'http://52.203.210.252/CoCreate-linkedin/demo/getProfile.html';
const ACCESS_TOKEN = 'AQX7GXFDh3wgpheCZYDwzEF-LxRwiygHXXxS6uhzeD5IBqLwO7EMinWKD81qTG8XNgoZ1VsgcELbRBKTGVnErrP74_lMKEAjPIS-7A-PRpdFkP9wlLNi-bjZjl6L58VXv1t9Y5ruCpD_8HnndGvia5MScFLFv4LZH2yYP8VGjJdjpW8z_qL8BBGFLDQgD-nFAwVpetDt2ppv55RR-v6P6ZlFuDM_4c47At5JyYc42dk6tfKoprBQwlhJiMDZuHZEsfFf9L2r-Ej8UDJ9pattv5cYJ1L152YXhKB0MSdNFWs82R9UP8EL-3dd1NpChf1n_wsR49Tq6DtctnzciRyLVYBGmA5LOw';

class CoCreateDataLinkedin {

    constructor(wsManager) {
        this.wsManager = wsManager;
        this.module_id = "linkedin";
        this.init();
    }

    init() {
        if (this.wsManager) {
            this.wsManager.on(this.module_id, (socket, data) => this.sendLinkedin(socket, data));
        }
    }

    async sendLinkedin(socket, data) {
        const type = data['type'];
        const linkedinRes = new LinkedInRestClient(LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET, CALL_BACK_URL);
        switch (type) {
            case 'getLinkedinProfile':
                this.getLinkedinProfile(socket, type, linkedinRes);
                break;
            case 'publishPost':
                this.publishPost(socket, type, data, linkedinRes);
                break;
            case 'deletePost':
                this.deletePost(socket, type, data, linkedinRes);
                break;
        }
    }

    async getLinkedinProfile(socket, type, linkedinRes) {
        const profile = await linkedinRes.getCurrentMemberProfile(['id', 'firstName', 'lastName', 'profilePicture'], ACCESS_TOKEN);
        const imageInfo = profile.profilePicture.displayImage;
        const imageInfoArr = imageInfo.split(":");
        profile.profilePicture.displayImage = imageInfoArr[3];
        const response = {
            'object': 'list',
            'data': [profile],
        };
        utils.send_response(this.wsManager, socket, { "type": type, "response": response }, this.module_id)
    }

    async publishPost(socket, type, data, linkedinRes) {
        const reqData = data.data;
        const linkedinId = reqData.id;
        const postData = {
            content: {
                contentEntities: [
                    {
                        entityLocation: "https://www.example.com/content.html",
                        thumbnails: [
                            {
                                "resolvedUrl": "https://www.example.com/image.jpg"
                            }
                        ]
                    }
                ],
                title: reqData.title
            },
            distribution: {
                linkedInDistributionTarget: {}
            },
            owner: "urn:li:person:"+linkedinId,
            subject: reqData.title,
            text: {
                text: reqData.content
            }
        };
        const responseData = await linkedinRes.publishContent(linkedinId, postData, ACCESS_TOKEN);
        const response = {
            'object': 'list',
            'data': [responseData],
        };
        utils.send_response(this.wsManager, socket, { "type": type, "response": response }, this.module_id);
    }
    
    async updatePost(socket, type, data, linkedinRes) {
        const reqData = data.data;
        const linkedinId = reqData.id;
        const updateData = {
            patch: {
                $set: {
                    text: {
                        annotations: [],
                        text: "Edit my share!"
                    }
                }
            }
        };
        const responseData = await linkedinRes.updatePost(linkedinId, updateData, ACCESS_TOKEN);
        utils.send_response(this.wsManager, socket, { "type": type, "response": responseData }, this.module_id);
    }
    
    async deletePost(socket, type, data, linkedinRes) {
        const reqData = data.data;
        const linkedinId = reqData.id;
        const responseData = await linkedinRes.deletePost(linkedinId, ACCESS_TOKEN);
        const response = {
            'object': 'list',
            'data': [{'status':responseData}],
        };
        utils.send_response(this.wsManager, socket, { "type": type, "response": response }, this.module_id);
    }

}

module.exports = CoCreateDataLinkedin;
