'use strict'
const utils = require('../utils');
const LinkedInRestClient = require("./LinkedInRestClient");
/*
const LINKEDIN_CLIENT_ID = '78mawgifvkfkk1';
const LINKEDIN_CLIENT_SECRET = 'Yz1UXE9fQRgHFST2';
const CALL_BACK_URL = 'http://52.203.210.252/CoCreate-linkedin/demo/getProfile.html';
const ACCESS_TOKEN = 'AQX7GXFDh3wgpheCZYDwzEF-LxRwiygHXXxS6uhzeD5IBqLwO7EMinWKD81qTG8XNgoZ1VsgcELbRBKTGVnErrP74_lMKEAjPIS-7A-PRpdFkP9wlLNi-bjZjl6L58VXv1t9Y5ruCpD_8HnndGvia5MScFLFv4LZH2yYP8VGjJdjpW8z_qL8BBGFLDQgD-nFAwVpetDt2ppv55RR-v6P6ZlFuDM_4c47At5JyYc42dk6tfKoprBQwlhJiMDZuHZEsfFf9L2r-Ej8UDJ9pattv5cYJ1L152YXhKB0MSdNFWs82R9UP8EL-3dd1NpChf1n_wsR49Tq6DtctnzciRyLVYBGmA5LOw';
*/
const { getOrg } = require("../../utils/crud.js");

class CoCreateLinkedin {

    constructor(wsManager) {
        this.wsManager = wsManager;
        this.module_id = "linkedin";
        this.init();
        this.enviroment = 'test';
        this.LINKEDIN_CLIENT_ID = null;
        this.LINKEDIN_CLIENT_SECRET = null;
        this.CALL_BACK_URL = null;
        this.ACCESS_TOKEN = null;
    }

    init() {
        if (this.wsManager) {
            this.wsManager.on(this.module_id, (socket, data) => this.sendLinkedin(socket, data));
        }
    }

    async sendLinkedin(socket, data) {
        const type = data['type'];
        const params = data['data'];
        
        try{
                let enviroment = typeof params['enviroment'] != 'undefined' ? params['enviroment'] : this.enviroment;
                let org_row = await getOrg(params,this.module_id);
                this.LINKEDIN_CLIENT_ID = org_row['apis.'+this.module_id+'.'+enviroment+'.LINKEDIN_CLIENT_ID'];
                this.LINKEDIN_CLIENT_SECRET = org_row['apis.'+this.module_id+'.'+enviroment+'.LINKEDIN_CLIENT_SECRET'];
                this.CALL_BACK_URL = org_row['apis.'+this.module_id+'.'+enviroment+'.CALL_BACK_URL'];
                this.ACCESS_TOKEN = org_row['apis.'+this.module_id+'.'+enviroment+'.ACCESS_TOKEN'];
      	 }catch(e){
      	   	console.log(this.module_id+" : Error Connect to api",e)
      	   	return false;
      	 }
      
        const linkedinRes = new LinkedInRestClient(this.LINKEDIN_CLIENT_ID, this.LINKEDIN_CLIENT_SECRET, this.CALL_BACK_URL);
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
        const profile = await linkedinRes.getCurrentMemberProfile(['id', 'firstName', 'lastName', 'profilePicture'], this.ACCESS_TOKEN);
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
        const responseData = await linkedinRes.publishContent(linkedinId, postData, this.ACCESS_TOKEN);
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
        const responseData = await linkedinRes.updatePost(linkedinId, updateData, this.ACCESS_TOKEN);
        utils.send_response(this.wsManager, socket, { "type": type, "response": responseData }, this.module_id);
    }
    
    async deletePost(socket, type, data, linkedinRes) {
        const reqData = data.data;
        const linkedinId = reqData.id;
        const responseData = await linkedinRes.deletePost(linkedinId, this.ACCESS_TOKEN);
        const response = {
            'object': 'list',
            'data': [{'status':responseData}],
        };
        utils.send_response(this.wsManager, socket, { "type": type, "response": response }, this.module_id);
    }

}

module.exports = CoCreateLinkedin;
