<?php
header("Content-type: application/json");
session_start();

$debug = true;

if($debug) {
  header("Access-Control-Allow-Origin: http://localhost:8000");
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
  header("Access-Control-Allow-Credentials: true");
}

function exceptionHandler($e) {
  echo '{"error":{"msg":' . json_encode($e->getMessage()) . '}}';
  exit;
}

set_exception_handler('exceptionHandler');

$server = "mysql.5tephen.com";
$db = new PDO('mysql:host=' . $server . ';dbname=pointerpointer', 'moonmayor', 'teveaver', array( PDO::ATTR_PERSISTENT => false));
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

/**
  User Functions
*/

function load($name) {
  global $db;

  $q = $db->prepare('SELECT * FROM saves WHERE name=:name');
  $q->bindValue(':name', $name, PDO::PARAM_STR);
  $q->execute();

  return $q->fetchAll();
}

function save($name, $data) {
  global $db;

  $q = $db->prepare('INSERT INTO saves(name, data) VALUES(:name, :data)');
  $q->bindValue(':name', $id, PDO::PARAM_STR);
  $q->bindValue(':data', $network, PDO::PARAM_STR);
  $q->execute();

  return $db->lastInsertId();
}


/**
  Misc. Functions
*/

function resetdb() {
  exec("cat create_db.sql | sqlite3 panzoomtag.db");
  return "OK";
}

/**
  Input Handler
*/

$response = array();

if(isset($_GET["action"])) {
  switch($_GET["action"]) {
    case "load":
      if(empty($_GET["name"])) throw new Exception ("Parameter name empty.");
      $response["data"] = load($_GET["name"]);
      break;
    case "save":
      if(empty($_GET["name"])) throw new Exception ("Parameter name empty.");
      if(empty($_GET["data"])) throw new Exception ("Parameter data empty.");
      save($_GET["name"], $_GET["data"]);
      break;
    case "upvote":
      if(empty($_GET["username"])) throw new Exception ("Parameter username empty.");
      if(empty($_GET["password"])) throw new Exception ("Parameter password empty.");
      $result = customLogin($_GET["username"], $_GET["password"]);
      if ($result == "success" || $result == "new_account") {
        $response = getFindingsForUser();
      } else {
        $response = "incorrect_password";
      }
      break;
    case "downvote":
      if(empty($_SESSION["userId"])) throw new Exception("Session userId has not been set up");
      if(empty($_GET["landmark"])) throw new Exception ("Parameter landmark empty.");

      $skip = $_GET["skip"] ? intval($_GET["skip"]) : 0;
      $num = $_GET["num"] ? intval($_GET["num"]) : 500;

      createFinding($_GET["landmark"]);
      if (is_int(json_decode($_GET["landmark"]))) {
        $response = getFindingsForLandmark($_GET["landmark"], $skip, $num);
      } else {
        $response = "thanks";
      }
      break;
    case "createAnonymousFinding":
      if(empty($_GET["displayName"])) throw new Exception("Parameter displayName has not been set up");
      if(empty($_GET["landmarkId"])) throw new Exception ("Parameter landmarkId empty.");

      $skip = $_GET["skip"] ? intval($_GET["skip"]) : 0;
      $num = $_GET["num"] ? intval($_GET["num"]) : 500;

      createAnonymousFinding($_GET["displayName"], $_GET["landmarkId"]);
      $response["userId"] = $_SESSION["userId"];
      $response["findings"] = getFindingsForLandmark($_GET["landmarkId"], $skip, $num);
      break;
  }
}

echo json_encode($response);
