<?php
$servername = "localhost";
$username = "root";
$password = "whx19990818";
$dbname = "mydb";

http_response_code(200);

// start connection
$connection = @new mysqli($servername, $username, $password, $dbname);

// Connection error handling
if ($connection->connect_error) {
  http_response_code(400);
  echo json_encode([
    'error'=>true,
    'message'=>($connection->connect_error)
  ]);
  exit();
}

//Lookup the page if given, otherwise lookup the first page by default
$pageSize = 20;
$pageNow = 1;
if (!empty($_GET['pageNow'])) {
  $pageNow = $_GET['pageNow'];
}

// Fetch total row count
$pageCount = 0;
$rowCount = 0;
$sql_row_fetch = 'SELECT COUNT(*) FROM courses
                      JOIN enrolments ON courses.ID = enrolments.Courses_ID
                      JOIN users ON users.ID = enrolments.Users_ID';
$result_row_fetch = $connection->query($sql_row_fetch);
if (!$result_row_fetch) {
  http_response_code(400);
  echo json_encode([
    'error'=>true,
    'message'=>'Failed to query row count'
  ]);
  exit();
}
while ($row = mysqli_fetch_array($result_row_fetch)) {
  $rowCount = $row['COUNT(*)'];
}

// Calculate total page number
$pageCount = ceil(($rowCount / $pageSize));

// To calculate the index of the last item in the previous page 
$startIndex = ($pageNow - 1) * $pageSize;

// Array to store query data
$data = array();

// Query data
$sql = 'SELECT * FROM courses
            JOIN enrolments ON courses.ID = enrolments.Courses_ID
            JOIN users ON users.ID = enrolments.Users_ID
            order by Surname, Firstname, Courses_ID limit ' . $startIndex . ', ' . $pageSize;
$results = $connection->query($sql);
if (!$results) {
  http_response_code(400);
  echo json_encode([
    'error'=>true,
    'message'=>'Failed to query enrolment data'
  ]);
  exit();
}

// Push query result into the data array
if ($results->num_rows > 0) {
  // output data of each row
  while ($row = $results->fetch_assoc()) {
    array_push(
      $data,
      array(
        "firstName" => $row["FirstName"],
        "surname" => $row["Surname"],
        "courseID" => $row["Courses_ID"],
        "description" => $row["Description"],
        "completionStatus" => $row["CompletionStatus"]
      )
    );
  }
}
$connection->close();

// Return the response containing the query result, total page count and row count
$response = array("data" => $data, "pageCount" => $pageCount, "rowCount" => $rowCount);
echo json_encode(array("response" => $response));
?>