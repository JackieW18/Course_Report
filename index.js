const StudentData = {
    data:{
        btn : document.querySelector("#but")
    },

    func:{
        init:function(){
            Index.func.getEnrolmentData();
        },
        getEnrolmentData:function(){
            fetch("./controllers/studentEnrolment.php",{
                method:'GET',
                mode:'cors',
                credentials:'include'
            })
            .then(response=> {
                console.log(response);
                return response.json()
            })
            .then(data=>{
                console.log(data);
            }).catch((error) =>{
                console.log(error);
                console.error("Error: ", error.message)
            })
        }
    }
}