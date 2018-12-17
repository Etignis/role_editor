$(document).ready(function(){
	var script_url='/coms/roles/roles_func.php';  
	var oEventBus = new Vue();
	Object.defineProperties(Vue.prototype, {
		$bus: {
			get: function () {
				return oEventBus
			}
		}
	})
  
  var player = new Vue({
    el: '#roles_comp',
    data: {
			aRoles: [
				{
					id: 1,
					role: "Role2",
					play: 2,
					persons: [
						{
							id: 4,
							order: 1
						}
					],
					order: 2,
					newVisible: false,
					newSelected: ""
				},				
				{
					id: 23,
					role: "Role1",
					play: 2,
					persons: [
						{
							id: 3,
							order: 2
						},
						{
							id: 2,
							order: 1
						}
					],
					order: 1,
					newVisible: false,
					newSelected: 5
				},
				{
					id: 3,
					role: "Role3",
					play: 5,
					persons:  [
						{
							id: 1,
							order: 1
						}
					],
					order: 3,
					newVisible: false,
					newSelected: ""
				}
			],
			aPersons: [
				{
					name: "name1",
					id: 1
				},
				{
					name: "name3",
					id: 3
				},
				{
					name: "name4",
					id: 4
				},
				{
					name: "name2",
					id: 2
				},
				{
					name: "new name",
					id: 5
				}
			],
			aPlays: [
				{
					name: "Play1",
					id: 2
				},
				{
					name: "Play2",
					id: 5
				}
			],
			sSelectedPlay: "",
			sNewRole: "",
			sNewRoleSing: "",
			bRoleAddition: false,
			bUpdating: false
    },
		computed: {
			aRolesFull: {
				get: function(){				
					let aRet = [];
					this.aRoles.filter(el => el.play == this.sSelectedPlay).forEach(function(oRole){
						let oItem = {};
						for (let el in oRole) {
							oItem[el] = oRole[el];
						}
						oItem.persons = oRole.persons.filter(el=>el.id).map(function(pers) {
							let oPers = this.aPersons.filter(el => (el.id == pers.id))[0];
							return {
								name: oPers.name,
								id: pers.id,
								order: pers.order
							};						
						}.bind(this))
						.sort((a,b) => a.order-b.order);
						
						aRet.push(oItem);
					}.bind(this));
					return aRet.sort((a,b) => a.order-b.order);
				},
				set: function(oRoleUpdated){
					
				}
			}		
		},
		mounted: function() {
			this.loadData();
		},
		methods: {
			loadData: function() {
				let that = this;
				this.bUpdating = true;
				$.ajax({
					url: script_url+'?stat=get',
					method: 'GET',
					success: function (data) {
						let o = JSON.parse(data);
						that.aRoles = o.aRoles.map(function(el){ el.newVisible = false; el.editVisible = false; el.newSelected = ""; el.persons = el.persons.split("|").map(function(pers, i){ return {id: pers, order: i}}); return el;});
						that.aPersons = o.aPersons;
						that.aPlays = o.aPlays;
						this.bUpdating = false;
					}.bind(this),
					error: function (error) {
						console.dir(error);
						this.bUpdating = false;
					}.bind(this)
				});
			},
			sendData: function(stat, oData){
				let that = this;
				let aParams = [];
				this.bUpdating = true;
				for(var key in oData) {
					aParams.push(key+"="+oData[key]);
				}
				const url = script_url+'?stat='+stat + "&"+aParams.join("&");
				console.log(url);
				var promise = new Promise(function(resolve, reject) {
					$.ajax({
						url: url,
						method: 'POST',
						success: function (data) {
							this.bUpdating = false;
							resolve();
						}.bind(this),
						error: function (error) {
							console.dir(error);
							this.bUpdating = false;
							reject();
						}.bind(this)
					});
				})
				return promise;
			},
			
			persDragStart: function(e, item, roleId) {
				if(!this.draggingPers){
					this.draggingPers = item; // 一旦保存
					this.draggingPers.roleId = roleId;
					e.target.style.opacity = 0.5;
					e.dataTransfer.setData('text/plain', 'dummy'); // Firefox用 http://stackoverflow.com/questions/21507189/dragenter-dragover-and-drop-events-not-working-in-firefox
				}
			},
			persDragEnd: function(e, Role) {
				e.target.style.opacity = 1;
				this.draggingPers = null;
				const aRoles = this.aRoles.filter(el=>el.role==Role.role);
				if(aRoles.length>0) {
					// sql
					const sRoleId = aRoles[0].id;
					const aPers = aRoles[0].persons.sort((a, b) => a.order-b.order).map(el=>el.id);
					this.sendData("update", {reason: "pers_order", "id": sRoleId, "data": aPers.join("|")});
					
				}
			},
			/**
			 * Item lay on target
			 * @param {object} item - target item
			 *
			 */
			persDragEnter: function(e, item, roleId) {
				/**/
				if(this.draggingPers){
					const tempIndex = item.order;
					let oRole = this.aRoles.filter(item => item.id == this.draggingPers.roleId)[0];
					// target person
					let oTargetPerson = oRole.persons.filter(el => el.id==item.id)[0];
					// dragged person
					let oDraggedPerson = oRole.persons.filter(el => el.id==this.draggingPers.id)[0];
					
					if(oTargetPerson.id!=oDraggedPerson.id) {
						oDraggedPerson.order =  item.order;
						oTargetPerson.order = this.draggingPers.order;
					}
					
				}
				/**/
			},
			
			
			/**
			 * Role start be dragged
			 * @param {object} item - item that we drag
			 *
			 */
			roleDragStart: function(e, item, roleId) {
				/**/
				this.draggingRole = item; // 一旦保存
				this.draggingRole.roleId = roleId;
				e.target.style.opacity = 0.5;
				e.dataTransfer.setData('text/plain', 'dummy'); 
				/**/
			},
			roleDragEnter: function(e, item, roleId) {
				/**/
				if(this.draggingRole) {
					const tempIndex = item.order;
					let oTargetRole = this.aRoles.filter(item => item.id == roleId)[0];
					let oDraggedRole = this.aRoles.filter(item => item.id == this.draggingRole.roleId)[0];
					if(oTargetRole.id != oDraggedRole.id){
						this.oRoleDragEntered = item;
						oTargetRole.order = this.draggingRole.order;
						oDraggedRole.order = tempIndex;
					}
					// sql
				}
				/**/
			},
			roleDragEnd: function(e, Role) {
				/**/
				e.target.style.opacity = 1;
				if(this.oRoleDragEntered){
					const aRoles = this.aRoles.filter(el=>el.role==this.oRoleDragEntered.role);
					if(aRoles.length>0) {
						// sql
						const sRoleId = aRoles[0].id;
						const nRoleOrder = aRoles[0].order;
						const aPers = aRoles[0].persons.sort((a, b) => a.order-b.order).map(el=>el.id);
						this.sendData("update", {reason: "role_order", "id1": sRoleId, "no1": nRoleOrder, "id2": this.draggingRole.id, "no2": this.draggingRole.order});					
					}				
				}
				this.draggingRole = null;
				this.oRoleDragEntered = null;
				/**/
			},
				
			addPerson: function(roleId){
				let oRole = this.aRoles.filter(item => item.id == roleId)[0];
				if(!oRole.newVisible) {
					oRole.newVisible = true;
				}
			},
			showAddRole: function(){
				this.bRoleAddition = true;
			},
			addRole: function(){
				this.bRoleAddition = false;
				if(this.sNewRole.length) {
					nMaxOrder = 1+this.aRolesFull[this.aRolesFull.length-1].order;
					nMaxId = 1+this.aRolesFull[this.aRolesFull.length-1].id;
					/*/			
					this.aRoles.push({
						id: nMaxId,
						order: nMaxOrder,
						role: this.sNewRole,
						play: this.sSelectedPlay,
						newVisible: false,
						newSelected: "",
						persons: []
					});
					/**/
					const pRolesUpdate = this.sendData("update", {reason: "role", no: nMaxOrder, role: this.sNewRole, role_sing: this.sNewRoleSing, play_id: this.sSelectedPlay});	
					this.sNewRole = "";
					pRolesUpdate.finally(function(){this.loadData();}.bind(this));
					// sql
				}
			},
				
			selectNewPerson: function(e, roleId){
				let oRole = this.aRoles.filter(item => item.id == roleId)[0];
				oRole.newSelected = e.target.value;
				
				let nMaxOrder = oRole.persons.length? oRole.persons.sort((a,b)=> b.order-a.order)[0].order : "0";
				if(oRole.persons.filter(el=>el.id==oRole.newSelected).length<1) {
					oRole.persons.push({
						id: oRole.newSelected,
						order: nMaxOrder+1
					});
					this.sendData("update", {reason: "pers_add", role_id: oRole.id, pers_id: oRole.newSelected});	
				}
				oRole.newVisible = false;	
			},
				
			removePerson: function(sPersId, sRoleId){
				let oRole = this.aRoles.filter(item => item.id == sRoleId)[0];
				oRole.persons = oRole.persons.filter(item => item.id!=sPersId);
				// sql
			},
				
			removeRole: function(sRoleId){
				this.aRoles = this.aRoles.filter(el => el.id!=sRoleId);
				// sql
			},
			
			editRole: function(sRoleId){
				let oRole = this.aRoles.filter(el => el.id==sRoleId)[0];
				oRole.editVisible = true;
			},			
			applyRole: function(sRoleId, sRole, sRoleSing){				
				const oRoleFormatted = this.aRoles.filter(el => el.id==sRoleId)[0];
				let oRole = this.aRoles.filter(el=>el.id==oRoleFormatted.id)[0];
				oRole.editVisible = false;
				oRole.role = sRole;
				oRole.role_sing = sRoleSing;
				///sql
			},			
			cancelRole: function(sRoleId){				
				const oRoleFormatted = this.aRoles.filter(el => el.id==sRoleId)[0];
				let oRole = this.aRoles.filter(el=>el.id==oRoleFormatted.id)[0];
				oRole.editVisible = false;
			}
		},
  });
});