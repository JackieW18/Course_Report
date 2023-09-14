var pageNumber = 1;
var pageSize = 20;
var totalPages = 0;
var paginationLimit = 15;

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

            totalPages = res.response.totalPages;
            setPagination();
        }).catch((error) => {
            console.log(error);
            console.error("Error: ", error.message)
        })
}

function previousPage() {
    pageNumber--;
    if (pageNumber <= 1) {
        pageNumber = 1;
    }
    getEnrolmentData();
}

function nextPage() {
    pageNumber++;
    if (pageNumber >= totalPages) {
        pageNumber = totalPages;
    }
    getEnrolmentData();
}

function hidePagination() {
    $(".pagination").append(`<li class="paginate_button" data-bs-toggle="modal" data-bs-target="#jump-page-modal">
                                            <a class="page-link" href="javascript:void(0);">...</a></li>`);
}

function setPagination() {
    // Pagination
    $(".pagination").html("");
    
    // previous button
    $(".pagination").append(`<li class="paginate_button previous" onclick="previousPage()">
                                <a class="page-link" href="javascript:void(0);" aria-label="Previous">
                                    <span class="sr-only">Previous</span>
                                </a>
                            </li>`)

    // Check if there are too many pages
    if (totalPages >= paginationLimit) {
        if (pageNumber < 5) {
            for (var i = 1; i <= 7; i++) {
                $(".pagination").append(`<li class="paginate_button page-item" data-pageNumber=${i}>
                                            <a class="page-link" href="javascript:void(0);">${i}</a></li>`);
            }
            hidePagination();
            $(".pagination").append(`<li class="paginate_button page-item" data-pageNumber=${totalPages}>
                                            <a class="page-link" href="javascript:void(0);">${totalPages}</a></li>`);
            $(".page-item").eq(pageNumber - 1).addClass("active").siblings().removeClass("active");
        } else if (pageNumber > totalPages - 4) {
            $(".pagination").append(`<li class="paginate_button page-item" data-pageNumber=1>
                                            <a class="page-link" href="javascript:void(0);">1</a></li>`);
            hidePagination();
            for (var i = 6; i >= 0; i--) {
                $(".pagination").append(`<li class="paginate_button page-item" data-pageNumber=${totalPages - i}>
                                            <a class="page-link" href="javascript:void(0);">${totalPages - i}</a></li>`);
            }
            $(".page-item").eq(7 - totalPages + pageNumber).addClass("active").siblings().removeClass("active");
        } else {
            $(".pagination").append(`<li class="paginate_button page-item" data-pageNumber=1>
                                            <a class="page-link" href="javascript:void(0);">1</a></li>`);
            hidePagination();
            for (var i = 2; i >= -2; i--) {
                $(".pagination").append(`<li class="paginate_button page-item" data-pageNumber=${pageNumber - i}>
                                            <a class="page-link" href="javascript:void(0);">${pageNumber - i}</a></li>`);
            }
            hidePagination();
            $(".pagination").append(`<li class="paginate_button page-item" data-pageNumber=${totalPages}>
                                            <a class="page-link" href="javascript:void(0);">${totalPages}</a></li>`);
            $(".page-item").eq(3).addClass("active").siblings().removeClass("active");
        }
    } else {
        // Create pagination normally
        for (var i = 1; i <= totalPages; i++) {
            $(".pagination").append(`<li class="paginate_button page-item" data-pageNumber=${i}>
                                        <a class="page-link" href="javascript:void(0);">${i}</a></li>`)
        }
        $(".page-item").eq(pageNumber - 1).addClass("active").siblings().removeClass("active");
    }

    $(".pagination").append(`<li class="paginate_button next" onclick="nextPage()">
                                <a class="page-link" href="javascript:void(0);" aria-label="Next">
                                    <span class="sr-only">Next</span>
                                </a>
                            </li>`);
}

$(document).ready(function () {
    $("body").on("click", ".page-item", function () {
        pageNumber = Number($(this).attr("data-pageNumber"));
        getEnrolmentData()
    });

    $("#btn-jump-page").click(function () {
        let input = $("#pagination-input").val().trim();
        // Do nothing if no input
        if (!input.length) return;
        //validate input
        if (isNaN(Number(input))) {
            alert("Invalid page number");
        } else if (Number(input) > totalPages || Number(input) < 1) {
            alert("Page out of range");
        } else {
            pageNumber = Number(input);
            $("#pagination-input").val("");
            $("#jump-page-modal").modal('hide');
            getEnrolmentData();
        }
    });
})

