<?
if($_SESSION[stat]>6) {
	
$Form = "2";
$Form="<div id='roles_comp'>
	<select
		v-model='sSelectedPlay'				
		>
		<option disabled>[Выберите спектакль]</option>
		<option
			v-for='oPlay in aPlays'
			v-bind:value='oPlay.id'												
		>
		{{oPlay.name}}
		</option>
	</select>
	<button @click='loadData'>Обновить</button>
	<span v-show='bUpdating'>Обновление...</span>
	<ul class='roles'>
		<li
			v-for='Item in aRolesFull'
			:key='Item.id'
			draggable='true'
			v-on:dragstart='roleDragStart($event, Item,  Item.id)' 
			v-on:dragend='roleDragEnd($event, Item)' 
			v-on:dragenter='roleDragEnter($event, Item,  Item.id)'
			>
			<span 
				class='deleteRole'
				@dblclick='removeRole(Item.id)'
				>
				&#10005
			</span>
			<span @dblclick='editRole(Item.id)' v-if='!Item.editVisible'>{{Item.role}}</span>
			<span v-if='Item.editVisible' v-on:keyup.13='cancelRole(Item.id)'>
				<input v-model='Item.role' v-on:keyup.13='cancelRole(Item.id)'>
				<input v-model='Item.role_sing' v-on:keyup.13='cancelRole(Item.id)'>
				<span
					@click='applyRole(Item.id, Item.role, Item.role_sing)'
					>
					&#10003 
				</span>
			</span> - 						
			<ul class='performers'>
				<li
					v-for='Pers in Item.persons'
					:key='Pers.id'
					draggable='true'
					v-on:dragstart='persDragStart($event, Pers,  Item.id)' 
					v-on:dragend='persDragEnd($event, Item)' 
					v-on:dragenter='persDragEnter($event, Pers,  Item.id)'
					>
					{{Pers.name}} 
					<span class='remove'
						@dblclick='removePerson(Pers.id, Item.id)'
						>
						&#10005
					</span>
				</li>
				<li
					v-if='Item.newVisible'
					>
					<select
						@change='selectNewPerson($event, Item.id)'									
						>
						<option
							v-for='oPers in aPersons'
							v-bind:value='oPers.id'
						>
						{{oPers.name}}
						</option>
					</select>
					<input v-model='sTmpYear' type='date' placeholder='Год' style='width: 5em'>
					<!--button class='selCur'>v</button-->
				</li>
				<li class='add'
					@click='addPerson(Item.id)'
					>
					+
				</li>
			</ul>					
		</li>
		
		<li class='addRole' v-if='sSelectedPlay'>
			<span v-if='bRoleAddition'>
				<input v-model='sNewRole' placeholder='Роль'> 
				<input v-model='sNewRoleSing' placeholder='Роль в единственном числе'> 
				<span
					@click='addRole'
					>
						&#10003 
					</span>
			</span>
			<span  
				v-if='!bRoleAddition' 
				@click='showAddRole'>
				Добавить роль
			</span>
		</li>
	</ul>
	<p>
	
	<details>
		<summary>Коллектив</summary>
		<div v-if='bPersAdding'>
			<input placeholder='Имя Фамилия' v-model='sNewName'/>
			<input placeholder='статус 2 (2/3)' v-model='sNewStat2' type='number'/>
			<input placeholder='ссылка' v-model='sNewLink'/>
			<input type='date' v-model='sNewDate'/>
			<div style='text-align: right'>
				<button @click='addNewPerson'>Добавить</button>
			</div>
		</div>
		<div>
			<button v-if='!bPersAdding' @click='showNewPersonAdder'>Добавить актера</button>
			<button v-if='bPersAdding' @click='hideNewPersonAdder'>Отменить</button>
		</div>
	</details>
	</p>
	
<details>
<summary>Данные</summary>
<pre>
Выбранный спектакль:
{{sSelectedPlay}}
----
aRolesFull:
{{aRolesFull}}
----
aRoles:
{{aRoles}}
</pre>
</details>

</div>";
echo $Form;
}
echo ($_SESSION[stat] || "0");
?>