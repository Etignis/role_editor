<?php session_start();
define('TT_KEY', true);
require_once("../../db.php");
//require_once("afisha_class.php");
require_once("../../funk/fff.php");
$SiteURL='http://'.$_SERVER['HTTP_HOST'];
/**/
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
/**/
if($_GET['stat']=='get'){
	echo '{'.getPlays().', '.getKollectiv().', '.getRoles().'}';
	//echo "{}";
}

if($_POST['stat']=='updtae' && $_SESSION[stat]>6){
	$ret=0;
	
	// update persons order in role
	if($_POST['reason']=='pers_order'){
		/*/
		UPDATE table_name
		SET column1 = value1, column2 = value2, ...
		WHERE condition;
		/**/
		$role_id = $_POST['id'];
		$koll_id = $_POST['data'];
		$query="UPDATE roles SET koll_id = '$koll_id' WHERE id='$role_id'";    		
		$result = mysql_query($query) or die("i'm dead [".$query."]");
		if($result){
			$ret=1;
		}	
	}
	
	// update roles order
	if($_POST['reason']=='role_order'){
		$role_id1 = $_POST['id1'];
		$no1 = $_POST['no1'];
		$role_id2 = $_POST['id2'];
		$no2 = $_POST['no2'];
		$query="UPDATE roles SET no = '$no1' WHERE id='$role_id1'; UPDATE roles SET no = '$no2' WHERE id='$role_id2'";    		
		$result = mysql_query($query) or die("i'm dead [".$query."]");
		if($result){
			$ret=1;
		}	
	}
}


?>