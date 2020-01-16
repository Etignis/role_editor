<?php session_start();
define('TT_KEY', true);
require_once("../../db.php");
//require_once("afisha_class.php");
require_once("../../funk/fff.php");
$SiteURL='http://'.$_SERVER['HTTP_HOST'];
/**/
$ret=-1;
function getPlays(){
	$a=array();	
	$query="SELECT play_id, play FROM `plays` ORDER BY play";    		
	$result = mysql_query($query) or die("i'm dead");
	while($line=mysql_fetch_array($result)) {		
		array_push ( $a, '{"id": "'.$line['play_id'].'", "name": "'.$line['play'].'"}' );
	} 	
	return '"aPlays": ['.implode(",", $a)."]";
}

function getKollectiv(){
	$a=array();	
	$query="SELECT koll_id, name FROM `kollektiv` WHERE stat2=2 OR stat2=3 OR stat2=0 ORDER BY name";    		
	$result = mysql_query($query) or die("i'm dead");
	while($line=mysql_fetch_array($result)) {		
		array_push ( $a, '{"id": "'.$line['koll_id'].'", "name": "'.$line['name'].'"}' );
	} 	
	return '"aPersons": ['.implode(",", $a).']';
}

function getRoles(){
	$a=array();	
	$query="SELECT id, role, role_sing, play_id, koll_id, no FROM `roles` ORDER BY play_id, no";    		
	$result = mysql_query($query) or die("i'm dead");
	while($line=mysql_fetch_array($result)) {		
		array_push ( $a, '{"id": "'.$line['id'].'", "role": "'.$line['role'].'", "role_sing": "'.$line['role_sing'].'", "play": "'.$line['play_id'].'", "order": "'.$line['no'].'", "persons": "'.$line['koll_id'].'"}' );
	} 	
	return '"aRoles": ['.implode(",", $a)."]";
}

function getRolesData(){
	$a=array();	
	$query="SELECT 
		roles.id AS role_id, 
		roles.role AS role_name, 
		role_sing, 
		play_id, 
		no, 
		person, 
		date 
	FROM 
		`roles` 
	LEFT JOIN 
		role_links 
	ON 
		roles.id = role_links.role 
	ORDER BY roles.play_id, roles.no";    		
	$result = mysql_query($query) or die("i'm dead");
	while($line=mysql_fetch_array($result)) {		
		array_push ( $a, '{"id": "'.$line['role_id'].'", "role": "'.$line['role_name'].'", "role_sing": "'.$line['role_sing'].'", "play": "'.$line['play_id'].'", "order": "'.$line['no'].'", "person_id": "'.$line['person'].'", "date": "'.$line['date'].'"}' );
	} 	
	return '"aRolesData": ['.implode(",", $a)."]";
}

function getRoleLinks(){
	$a=array();	
	$query="SELECT id, role, person, date, no FROM `role_links`";    		
	$result = mysql_query($query) or die("i'm dead");
	while($line=mysql_fetch_array($result)) {		
		array_push ( $a, '{"id": "'.$line['id'].'", "role": "'.$line['role'].'", "person": "'.$line['person'].'", "date": "'.$line['date'].'"}' );
	} 	
	return '"aRoleLinks": ['.implode(",", $a)."]";
}
/**/
if($_GET['stat']=='get'){
	echo '{'.getPlays().', '.getKollectiv().', '.getRoles().', '.getRolesData().', '.getRoleLinks().'}';
	//echo "{}";
}
//$ret= $_GET['stat']." ".$_SESSION['stat'];
if($_GET['stat']=='update' && $_SESSION['stat']>6){
	$ret=0;
	
	// update persons order in role
	if($_GET['reason']=='pers_order'){
		/*/
		UPDATE table_name
		SET column1 = value1, column2 = value2, ...
		WHERE condition;
		/**/
		$role_id = $_GET['id'];
		$koll_id = $_GET['data'];
		$query="UPDATE roles SET koll_id = '$koll_id' WHERE id='$role_id'";    		
		$result = mysql_query($query) or die("i'm dead [".$query."]");
		if($result){
			$ret=1;
		}	
	}
	
	// update roles order
	if($_GET['reason']=='role_order'){
		$data = $_GET['data'];
		$array=json_decode($data);
		
		foreach ($array as &$value) {
			$query="UPDATE roles SET no='$value->no' WHERE id='$value->id'";    		
			$result = mysql_query($query) or die("i'm dead [".$query."]");
			if($result){
				$ret.=1;
			}	
		}
		// массив $arr сейчас таков: array(2, 4, 6, 8)
		unset($value); // разорвать ссылку на последний элемент	
	
	}
	
	// add role
	if($_GET['reason']=='role'){
		$ret=2;
		$role = $_GET['role'];
		$role_sing = $_GET['role_sing'];
		$no = $_GET['no'];
		$play_id = $_GET['play_id'];
		$query="INSERT INTO roles (no, role, role_sing, play_id) VALUES ('$no', '$role', '$role_sing', '$play_id')";    		
		$result = mysql_query($query) or die("i'm dead [".$query."]");
		if($result){
			$ret=1;
		}	
	}
	// remove role
	if($_GET['reason']=='role_remove'){
		$role = $_GET['role_id'];
		$query="DELETE FROM roles WHERE id='$role'";    		
		$result = mysql_query($query) or die("i'm dead [".$query."]");
		if($result){
			$ret=1;
		}	
	}
	
	// update role
	if($_GET['reason']=='role_update'){
		$id = $_GET['role_id'];
		$role = $_GET['role'];
		$role_sing = $_GET['role_sing'];
		$query="UPDATE roles SET role = '$role', role_sing = '$role_sing' WHERE id='$id'";    		
		$result = mysql_query($query) or die("i'm dead [".$query."]");
		if($result){
			$ret=1;
		}	
	}
	// add/remove rerson to role (update all persons in one role)
	if($_GET['reason']=='pers_update'){
		$role_id = $_GET['role_id'];
		$pers_id = $_GET['pers_id'];
		$query="UPDATE roles SET koll_id = '$pers_id' WHERE id='$role_id'";    		
		$result = mysql_query($query) or die("i'm dead [".$query."]");
		if($result){
			$ret=1;
		}	
	}
	
	// add new person
	if($_GET['reason']=='person_add'){
		$ret=2;
		$name = $_GET['name'];
		$link = $_GET['link'];
		$stat2 = $_GET['stat2'];
		$date = $_GET['date'];
		$query="INSERT INTO kollectiv (name, link, stat2, date) VALUES ('$name', '$link', '$stat2', '$date')";    		
		$result = mysql_query($query) or die("i'm dead [".$query."]");
		if($result){
			$ret=1;
		}	
	}
	echo $ret;
}
?>