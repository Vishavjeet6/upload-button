formElem.onsubmit = async (e) => {
    e.preventDefault();

    function setID(){
    var url = window.location.href;
    var urlarr = url.split('/');
    var id = urlarr[urlarr.length - 1];
    document.formElem.userid.value = id;
    //   document.getElementById("userid").value = id;
    }

    function validate(){
       var size=5242880;
       if(document.getElementById('file_upload').files[0] === undefined) return false;
       var file_size=document.getElementById('file_upload').files[0].size;
       if(file_size>=size){
             return false;
       }
       return true;
    }

    if(validate()){
       setID();

       let response = await fetch('/upload/file', {
          method: 'POST',
          body: new FormData(formElem)
          });
       let result = await response.json();
      //  alert(result.message);
       if(response.status == 200){
         window.close();
       }
       
    }else{
       alert('Please upload file less than 5mb');
    }
 };