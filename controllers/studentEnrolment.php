<?php
// Only allow Post method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(404);
  echo json_encode([
    'error' => true,
    'message' => "Please use POST Method"
  ]);
  exit();
}

http_response_code(200);

// DB connection
$servername = "localhost";
$username = "root";
$password = "whx19990818";
$dbname = "mydb";
$connection = @new mysqli($servername, $username, $password, $dbname);

// Connection error handling
if ($connection->connect_error) {
  http_response_code(400);
  echo json_encode([
    'error' => true,
    'message' => ($connection->connect_error)
  ]);
  exit();
}

//Lookup the page if given, otherwise lookup the first page by default
$pageSize = 20;
$pageNumber = 1;
$totalPages = 0;
$totalRows = 0;

// Read POST parameters
if (isset($_POST)) {
  $input = file_get_contents("php://input");
  $req = json_decode($input, true);
  if (!empty($req['pageNumber'])) {
    $pageNumber = $req['pageNumber'];
  }

  if (!empty($req['pageSize'])) {
    $pageSize = $req['pageSize'];
  }
}

$sql_row_fetch = 'SELECT COUNT(*) FROM courses
                      JOIN enrolments ON courses.ID = enrolments.Courses_ID
                      JOIN users ON users.ID = enrolments.Users_ID';
$result_row_fetch = $connection->query($sql_row_fetch);
if (!$result_row_fetch) {
  http_response_code(400);
  echo json_encode([
    'error' => true,
    'message' => 'Failed to query row count'
  ]);
  exit();
}
while ($row = mysqli_fetch_array($result_row_fetch)) {
  $totalRows = $row['COUNT(*)'];
}

// Calculate total page number
$totalPages = ceil(($totalRows / $pageSize));

// To calculate the index of the last item in the previous page 
$startIndex = ($pageNumber - 1) * $pageSize;

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
    'error' => true,
    'message' => 'Failed to query enrolment data'
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

// Return the response containing the query result, total page count, total row count. start index and number of results
$response = array("data" => $data, "totalPages" => $totalPages, "totalRows" => $totalRows, "startIndex"=>$startIndex, "rowNumber"=> $results->num_rows);
echo json_encode(array("response" => $response));
?>