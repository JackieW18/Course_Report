getEnrolmentData();

async function getEnrolmentData() {
    await fetch("./controllers/studentEnrolment.php", {
        method: 'GET',
        mode: 'cors',
        credentials: 'include'
    })
        .then(res => {
            return res.json()
        })
        .then(res => {
            console.log(res);
            $("#enrolments-table tbody").remove();
            var tbody = $("<tbody></tbody>")
            res.response.data.forEach(item => {
                var tr = $("<tr></tr>");

                tr.append("<td>" + item.firstName + "</td>" +
                    "<td>" + item.surname + "</td>" +
                    "<td>" + item.courseID + "</td>" +
                    "<td>" + item.description + "</td>" +
                    "<td>" + item.completionStatus + "</td>");

                tbody.append(tr); // Append the table row to the table
            });
            $("#enrolments-table").append(tbody);
            $(".pagination-detail").append("Showing 1 to 20 of " + res.response.rowCount + " results")
        }).catch((error) => {
            console.log(error);
            console.error("Error: ", error.message)
        })
}