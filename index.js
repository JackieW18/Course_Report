var pageNumber = 1;
var pageSize = 16;
var totalPages = 0;

getEnrolmentData();

async function getEnrolmentData() {
    let url = "./controllers/studentEnrolment.php"

    await fetch(url, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify({
            'pageNumber': pageNumber,
            'pageSize': pageSize
        }),
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

            $(".pagination-detail").html(`Showing ${res.response.startIndex + 1} 
                                            to ${res.response.startIndex + res.response.rowNumber} 
                                            of ${res.response.totalRows} results`);
            
            // Pagination
            totalPages = res.response.totalPages;
            $(".pagination").html("");
            $(".pagination").append(`<li class="paginate_button previous" onclick="previousPage()">
                                        <a class="page-link" href="javascript:void(0);" aria-label="Previous">
                                            <span class="sr-only">Previous</span>
                                        </a>
                                    </li>`)
            for (var i = 1; i <= totalPages; i++) {
                $(".pagination").append(`<li class="paginate_button page-item" data-pageNumber="${i}">
                                            <a class="page-link" href="javascript:void(0);">${i}</a></li>`)
            }
            $(".pagination").append(`<li class="paginate_button next" onclick="nextPage()">
                                        <a class="page-link" href="javascript:void(0);" aria-label="Next">
                                            <span class="sr-only">Next</span>
                                        </a>
                                    </li>`);

            $(".page-item").eq(pageNumber - 1).addClass("active").siblings().removeClass("active");
        }).catch((error) => {
            console.log(error);
            console.error("Error: ", error.message)
        })
}

function previousPage() {
    pageNumber--;
    if(pageNumber<=1){
        pageNumber=1;
    }
    getEnrolmentData();
}

function nextPage() {
    pageNumber++;
    if(pageNumber>=totalPages){
        pageNumber = totalPages;
    }
    getEnrolmentData();
}

$(document).ready(function () {
    $("body").on("click", ".page-item", function () {
        pageNumber = $(this).attr("data-pageNumber");
        getEnrolmentData()
    });
})

