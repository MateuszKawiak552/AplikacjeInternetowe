const msg: string = "Hello!";

alert(msg);


function loadCssFile(filename:string):void{
    const fileRef : HTMLLinkElement =document.createElement("link");
    fileRef.setAttribute("rel","stylesheet");
    fileRef.setAttribute("type","text/css");
    fileRef.setAttribute("href",filename);
document.getElementsByTagName("head")[0].appendChild(fileRef);
}

const firstStyle:string ="csslab1.css";
const secoStyle:string ="csslab2.css";