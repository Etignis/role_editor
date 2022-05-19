<?php session_start();
define('TT_KEY', true);
require_once("../../db.php");
//require_once("afisha_class.php");
require_once("../../funk/fff.php");
$SiteURL='http://'.$_SERVER['HTTP_HOST'];
/**/
$ret=-1;

function getPlays($bVal){
	$a=array();	
	$query="SELECT play_id, play, date, role_mode, FROM `plays` ORDER BY play";   
	if($bVal) {
	  $query="SELECT play_id, play, date, role_mode, body, img_v2 FROM `plays` ORDER BY play"; 		
	}	
	$result = mysql_query($query) or die("i'm dead");
	while($line=mysql_fetch_array($result)) {		
		/*array_push ( $a, '{"id": "'.$line['play_id'].'", "name": "'.$line['play'].'", "date": "'.$line['date'].'", "body": "'.$line['date'].'", "img": "'.$line['img_v2'].'", "role_mode": "'.$line['role_mode'].'"}' );*/
		
		$arr = array(
			'id' => $line['play_id'], 
			'name' => $line['play'], 
			'date' => $line['date'], 
			'body' => $line['body'], 
			'img' => $line['img_v2']
		);
		array_push ( $a, $arr);
	} 	
	//return '"aPlays": ['.implode(",", $a)."]";
	
	$Plays = array(
		'aPlays' => $arr
	);
	
	//return '';
	
	return $a;
}

function getKollectiv(){
	$a=array();	
	$query="SELECT koll_id, name, stat, stat2, dk_code, link, date, show_in_koll FROM `kollektiv` ORDER BY name";    		
	$result = mysql_query($query) or die("i'm dead");
	while($line=mysql_fetch_array($result)) {		
		//array_push ( $a, '{"id": "'.$line['koll_id'].'", "name": "'.$line['name'].'"}' );
		
		$arr = array(
			'id' => $line['koll_id'], 
			'name' => $line['name'], 
			'link' => $line['link'], 
			'stat' => $line['stat'], 
			'stat2' => $line['stat2'],
			'show_in_koll' => $line['show_in_koll'],
			'date' => $line['date'],
			'dk_code' => $line['dk_code']
		);
		array_push ( $a, $arr);
	} 	
	return $a;
	//return '"aPersons": ['.implode(",", $a).']';
}

function getRoles(){
	$a=array();	
	$query="SELECT id, role, role_sing, play_id, koll_id, no FROM `roles` ORDER BY play_id, no";    		
	$result = mysql_query($query) or die("i'm dead 0");
	while($line=mysql_fetch_array($result)) {		
	//	array_push ( $a, '{"id": "'.$line['id'].'", "role": "'.addslashes($line['role']).'", "role_sing": "'.addslashes($line['role_sing']).'", "play": "'.$line['play_id'].'", "order": "'.$line['no'].'", "persons": "'.$line['koll_id'].'"}' );
		
		$arr = array(
			'id' => $line['id'], 
			'role' => addslashes($line['role']), 
			'role_sing' => addslashes($line['role_sing']), 
			'play' => $line['play_id'], 
			'order' => $line['no'],
			'persons' => $line['koll_id']
		);
		array_push ( $a, $arr);
	} 	
	//return '"aRoles": ['.implode(",", $a)."]";
	return $a;
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
	$result = mysql_query($query) or die("i'm dead 1");
	while($line=mysql_fetch_array($result)) {		
		//array_push ( $a, '{"id": "'.$line['role_id'].'", "role": "'.$line['role_name'].'", "role_sing": "'.$line['role_sing'].'", "play": "'.$line['play_id'].'", "order": "'.$line['no'].'", "person_id": "'.$line['person'].'", "date": "'.$line['date'].'"}' );
		
		$arr = array(
			'id' => $line['role_id'], 
			'role' => $line['role_name'], 
			'role_sing' => $line['role_sing'], 
			'play' => $line['play_id'], 
			'order' => $line['no'],
			'persons' => $line['person'],
			'date' => $line['date']
		);
		array_push ( $a, $arr);
	} 	
	//return '"aRolesData": ['.implode(",", $a)."]";
	return $a;
}

function getRoleLinks(){
	$a=array();	
	$query="SELECT id, role, person, date FROM `role_links`";    		
	$result = mysql_query($query) or die("i'm dead 2");
	while($line=mysql_fetch_array($result)) {		
		//array_push ( $a, '{"id": "'.$line['id'].'", "role": "'.$line['role'].'", "person": "'.$line['person'].'", "date": "'.$line['date'].'"}' );
		
		$arr = array(
			'id' => $line['id'], 
			'role' => $line['role'], 
			'person' => $line['person'], 
			'date' => $line['date']
		);
		array_push ( $a, $arr);
	} 	
	//return '"aRoleLinks": ['.implode(",", $a)."]";
	return $a;
}
/**/
if($_GET['state']=='get'){
	//echo '{'.getPlays().', '.getKollectiv().', '.getRoles().', '.getRolesData().', '.getRoleLinks().'}';
	$ret = array(
		'aPlays' => getPlays(true),
		'aPersons' => getKollectiv(),
		'aRoles' => getRoles(),
		'aRolesData' => getRolesData(),
		'aRoleLinks' => getRoleLinks(),
	);
	echo json_encode($ret);
	//echo "{}";
}
if($_GET['state']=='get_prog'){
	//echo '{'.getPlays(true).', '.getKollectiv().', '.getRoles().', '.getRolesData().', '.getRoleLinks().'}';
	
	$ret = array(
		'aPlays' => getPlays(true),
		'aPersons' => getKollectiv(),
		'aRoles' => getRoles(),
		'aRolesData' => getRolesData(),
		'aRoleLinks' => getRoleLinks(),
	);
	echo json_encode($ret);
	//echo "{}";
}
//$ret= $_GET['state']." ".$_SESSION['state'];
if($_GET['state']=='update' && $_SESSION['stat']>6){
	$ret=0;
	
	// update person info
	if($_GET['reason']=='person_info'){
		$ret=2;
		$id = $_GET['id'];
		$name = $_GET['name'];
		$link = $_GET['link'];
		$stat = $_GET['stat'];
		$stat2 = $_GET['stat2'];
		$show_in_koll = $_GET['show_in_koll'];
		$date = $_GET['date'];
		$dk_code = $_GET['dk_code'];		
		$query="UPDATE kollektiv 
			SET 
				name='$name', 
				link='$link', 
				stat='$stat', 
				stat2='$stat2', 
				show_in_koll='$show_in_koll', 
				date='$date', 
				dk_code='$dk_code' 
			WHERE 
				koll_id='$id'";    		
		$result = mysql_query($query) or die("i'm dead [".$query."]");
		if($result){
			$ret=$query;//1;
		}	
	}
	
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
	if($_GET['reason']=='roles_order'){
		$ret=1;
		/**/
		$data = $_GET['data'];
		
		$array=explode("|", $data);
		/**/
		foreach ($array as &$value) {
			$tmp = explode("_", $value);
			$id = $tmp[0];
			$no = $tmp[1];
			$query="UPDATE roles SET no='$no' WHERE id='$id'";    		
			$result = mysql_query($query)/* or die("i'm dead [".$query."]")*/;
			if($result){
				$ret.=1;
			}	else {
				$ret.="error on ".$query;
			}
		}
		// массив $arr сейчас таков: array(2, 4, 6, 8)
		unset($value); // разорвать ссылку на последний элемент	
	/**/
	//$ret=$array;
	}
	
	// add role
	if($_GET['reason']=='role'){
		$ret=2;
		$role = $_GET['role'];
		$role_sing = $_GET['role_sing'];
		$no = $_GET['no'];
		$play_id = $_GET['play_id'];
		$role_type = $_GET['role_type'];
		
		$ret.= " (".$role.") {".strlen($role)."}";
		
		$pattern = '/"([^"]+)"/i';
		$replacement = "«$1»";
		$role = preg_replace($pattern, $replacement, $role);
		$role_sing = preg_replace($pattern, $replacement, $role_sing);
		
		$ret.= " (".$role.") {".strlen($role)." ".(strlen($role)<2)."}";
		if(strlen($role)<2 && $role_type == '2') {
			$role = "Исполнители";
		
			if(strlen($role_sing)<2 && $role_type == '2') {
				$role_sing = "Исполнитель";
			}
		}
		
		$query="INSERT INTO roles (no, role, role_sing, play_id, role_type) VALUES ('$no', '$role', '$role_sing', '$play_id', '$role_type')";    		
		$result = mysql_query($query) or die("i'm dead [".$query."]");
		if($result){
			$ret.=" 1 [".$role_type."] ";
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
	if($_GET['reason']=='performer_add'){
		$role_id = $_GET['role_id'];
		$pers_id = $_GET['pers_id'];
		$date = $_GET['date'];
		$query="INSERT INTO role_links (role, person, date) VALUES ('$role_id', '$pers_id', '$date')";    		
		$result = mysql_query($query) or die("i'm dead [".$query."]");
		if($result){
			$ret=1;
		}
	}
	if($_GET['reason']=='performer_remove'){
		$role_id = $_GET['role_id'];
		$pers_id = $_GET['pers_id'];
		$query="DELETE FROM role_links WHERE role='$role_id' AND person='$pers_id'";    		
		$result = mysql_query($query) or die("i'm dead [".$query."]");
		if($result){
			$ret=1;
		}
	}
	if($_GET['reason']=='performer_edit'){
		$link_id = $_GET['link_id'];
		$date = $_GET['date'];
		$query="UPDATE role_links SET date = '$date' WHERE id='$link_id'";    		
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
		$query="INSERT INTO kollektiv (name, link, stat2, date) VALUES ('$name', '$link', '$stat2', '$date')";    		
		$result = mysql_query($query) or die("i'm dead [".$query."]");
		if($result){
			$ret=1;
		}	
	}
	
	// roles type change
	if($_GET['reason']=='roles_type'){
		$ret=2;
		$type = $_GET['type'];
		$play = $_GET['play'];
	
		$query="UPDATE plays SET role_mode = '$type' WHERE play_id='$play'";      		
		$result = mysql_query($query) or die("i'm dead [".$query."]");
		if($result){
			$ret=1;
		}	
	}
	
	
	echo $ret;
}
?>