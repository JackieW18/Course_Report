function getEnrolmentData() {
    fetch("./controllers/studentEnrolment.php", {
        method: 'GET',
        mode: 'cors',
        credentials: 'include'
    })
        .then(res => {
            console.log(res);
            return res.json()
        })
        .then(res => {
            console.log(res);
        }).catch((error) => {
            console.log(error);
            console.error("Error: ", error.message)
        })
}