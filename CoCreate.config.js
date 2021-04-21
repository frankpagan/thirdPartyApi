module.exports = {
    config: {
        organization_id:"5ae0cfac6fb8c4e656fdaf92",
        apiKey:"38ffd014-c33b-4202-c54b-ac46a0a4",
        securityKey:"69faeace-b065-4c87-b880-22c2f0f3",
        host: "server.cocreate.app:8088"
    },
 
    sources: [{
            path: "./docs/index.html",
            collection: "files",
            document_id: "",
            key: "html",
            data:{
                name: "CoCreateApi Doc",
            }
        },
    ],
   
    crud: [{
            collection: "routes",
            document_id: "",
            data:{
                collection: "files",
                document_id: "",
                name: "html",
                domains: ["cocreate.app", "server.cocreate.app", "ws.cocreate.app"],
                route: "/docs/CoCreateApi",
            }
        }
    ],
    
    extract: {
        directory: "./src/",
        extensions: [
            "js",
            "css",
            "html"
        ],
        ignores: [
            "node_modules",
            "vendor",
            "bower_components",
            "archive"
        ],
    }
}
