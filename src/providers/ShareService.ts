export class ShareService {  
  
   public shareData:any;
 
    constructor() {
      this.shareData={};
    }
  
    setshareData(key,value) {
        this.shareData[key]=value;
    }
    getshareData(key) {
        return this.shareData[key]?this.shareData[key]:false;
    }   
}