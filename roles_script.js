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
	
	
   /* $("body").on("click", ".selCur", function(){
        $(this).parent().find("select").change();
    });	*/
  
  var player = new Vue({
    el: '#roles_comp',
    data: {
			aRoles: [
				// {
					// id: 1,
					// role: "Role2",
					// play: 2,
					// persons: [
						// {
							// id: 4,
							// order: 1,
							// date: ""
						// }
					// ],
					// order: 2,
					// newVisible: false,
					// newSelected: ""
				// },				
				// {
					// id: 23,
					// role: "Role1",
					// play: 2,
					// persons: [
						// {
							// id: 3,
							// order: 2,
							// date: ""
						// },
						// {
							// id: 2,
							// order: 1,
							// date: ""
						// }
					// ],
					// order: 1,
					// newVisible: false,
					// newSelected: 5
				// },
				// {
					// id: 3,
					// role: "Role3",
					// play: 5,
					// persons:  [
						// {
							// id: 1,
							// order: 1,
							// date: ""
						// }
					// ],
					// order: 3,
					// newVisible: false,
					// newSelected: ""
				// }
			],
			aPersons: [
				// {
					// name: "name1",
					// id: 1
				// },
				// {
					// name: "name3",
					// id: 3
				// },
				// {
					// name: "name4",
					// id: 4
				// },
				// {
					// name: "name2",
					// id: 2
				// },
				// {
					// name: "new name",
					// id: 5
				// }
			],
			aPlays: [
				// {
					// name: "Play1",
					// id: 2
				// },
				// {
					// name: "Play2",
					// id: 5
				// }
			],
			sSelectedPlay: "",
			sNewRole: "",
			sNewRoleSing: "",
			bNewRoleSpecial: false,
			bRoleAddition: false,
			bUpdating: false,
			
			bPlayRolesType: 1,
			
			bPersAdding: false,
			sNewName: "",
			sNewStat2: "",
			sNewLink: "",
			sNewDate: "",
			sNewQR: "",
			nMaxYear: new Date().getFullYear()+1,
			
			pers_editor: {
				selected_group: 2, // старшая группа
				selected_show: 1, // основной состав
				show_all: false,
				show_table: false,
				info: {
					name: '',
					link: '',
					id: '',
					stat: '',
					stat2: '',
					dk_code: '',
					date: '',
					show_in_koll: ''
				}
			},
			sTmpDate: "",
			sTmpPerformer: "",
			nTmpRoleEdit: "",
			nTmpPerfEdit: ""
    },
		computed: {
			aRolesFull: {
				get: function(){	
					let	that = this;			
					let aRet = [];
					this.aRoles.filter(el => el.play == this.sSelectedPlay).forEach(function(oRole){
						let oItem = {};
						for (let el in oRole) {
							oItem[el] = oRole[el];
						}
						oItem.persons = oRole.persons.filter(el=>el.id).map(function(pers) {
							let oPers = this.aPersons.filter(el => (el.id == pers.id))[0];
							//if(oPers.id==8) debugger;
							return oPers?{
								name: oPers.name,
								id: pers.id,
								order: pers.date,
								linkId: pers.linkId,
								isEdit: that.nTmpRoleEdit == oRole.id && that.nTmpPerfEdit == pers.id,
								date: pers.date /*|| this.aPlays[this.sSelectedPlay].year*/
							}:null;						
						}.bind(this)).filter(el => el!=null);
						oItem.persons= oItem.persons.sort((a,b) => {if(a.order<b.order) return -1;if(a.order>b.order) return 1; return 0;});
						
						aRet.push(oItem);
					}.bind(this));
					return aRet.sort((a,b) => a.order-b.order);
				},
				set: function(oRoleUpdated){
					
				}
			},
			nSelectedPalyRoleMode: function(){
				if(this.aPlays.length && this.sSelectedPlay) {
					return this.aPlays.find(el => el.id == this.sSelectedPlay).role_mode;
				}
				return 1;
			},
			sSelectePlayYear: function(){
				return this.aPlays.find(el => el.id == this.sSelectedPlay).date || "";
			},
			
			aSelectegGroupPersons: function(){
				if(!this.pers_editor.show_all && this.pers_editor.selected_group != undefined && this.pers_editor.selected_show != undefined) {
					return this.aPersons.filter(el=>el.stat2 == this.pers_editor.selected_group && el.show_in_koll == this.pers_editor.selected_show);
				} else {
					return this.aPersons.filter(el=>el.id>0);
				}
			},
			aQRPersons: function(){
				return this.aPersons.filter(el=>el.dk_code);
					
			},
			aQR_S: function(){
				let aPages = [];
				let aPersons = this.aQRPersons.filter(el => el.stat2==5);
				const chunkSize = 4;
				for (let i = 0; i < aPersons.length; i += chunkSize) {
						const chunk = aPersons.slice(i, i + chunkSize);
						aPages.push(chunk);
				}
				return aPages;
			},
			aQR_M: function(){
				let aPages = [];
				let aPersons = this.aQRPersons.filter(el => el.stat2==6);
				const chunkSize = 4;
				for (let i = 0; i < aPersons.length; i += chunkSize) {
						const chunk = aPersons.slice(i, i + chunkSize);
						aPages.push(chunk);
				}
				return aPages;
			},
			aQR_L: function(){
				let aPages = [];
				let aPersons = this.aQRPersons.filter(el => el.stat2==2);
				const chunkSize = 4;
				for (let i = 0; i < aPersons.length; i += chunkSize) {
						const chunk = aPersons.slice(i, i + chunkSize);
						aPages.push(chunk);
				}
				return aPages;
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
					url: script_url+'?state=get',
					method: 'GET',
					success: function (data) {
						let o = JSON.parse(data);
						that.aRoles = o.aRoles.map(function(el){
							el.newVisible = false; 
							el.editVisible = false; 
							el.newSelected = ""; 
							//if(el.id==84) debugger;
							let aLinks = o.aRoleLinks
														.filter(link=>link.role == el.id)
														.sort((a,b) => {
															if(a.order<b.order) return -1;
															if(a.order>b.order) return 1; 
															return 0;
														});
							
							el.persons = [];
							
							aLinks.forEach(function(oLink){
								//if(oLink.id == 142) debugger;
								let oPerformer = o.aPersons.find(perf=>perf.id == oLink.person);
								
								let oTmpPerformer = {};
								Object.assign(oTmpPerformer, oPerformer)
								oTmpPerformer.date = oLink.date;
								oTmpPerformer.isEdit = false;
								oTmpPerformer.linkId = oLink.id;
								
								el.persons.push(oTmpPerformer);
							});
							
							
							/*/
							el.persons = el.persons.split("|")
															.filter(el => el!="")
															.map(function(pers, i){ 
																let aData = pers.split(";"); 
																return {
																	id: aData[0], 
																	year: aData[1] || "", 
																	order: i
																}
															}); 
															/**/
															
							if(el.id==84) {
								console.dir(o.aPersons.filter(perf=>perf.id == 8));
								console.dir(el)
							};
							return el;
						});
						that.aPersons = [{
							name: "[Выберите исполнителя]",
							id: 0
						}].concat(o.aPersons);
						that.aPlays = o.aPlays;
						//that.aPlays.forEach(function(oPlay){oPlay.year = oPlay.date? oPlay.date.split("-")[0]: ""});
						this.bUpdating = false;
						
						try{
							setTimeout(this.generate_QRs, 1000);
						} catch (error) {
							console.log('[ERROR]: Не удалось сгенерировать QR');
							console.dir(error);
						}
					}.bind(this),
					error: function (error) {
						console.dir(error);
						this.bUpdating = false;
					}.bind(this)
				});
			},
			sendData: function(state, oData){
				let that = this;
				let aParams = [];
				this.bUpdating = true;
			//	const url = script_url+'?stat='+stat + "&"+aParams.join("&");
				const url = script_url;
				// let params = {};
				// params.stat = stat
				// for(var key in oData) {
					// params[key] = oData[key];
				// }
				let aData = ["state="+state];
				for(var key in oData) {
					aData.push(key+"="+oData[key]);
				}
				console.log(url);
				var promise = new Promise(function(resolve, reject) {
					$.ajax({
						url: url,
						method: 'GET',
						data: aData.join("&"),
						success: function (data) {
							that.bUpdating = false;
							resolve(data);
						}.bind(this),
						error: function (error) {
							console.dir(error);
							that.bUpdating = false;
							reject(error);
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
					const aPers = aRoles[0].persons.sort((a, b) => a.order-b.order).map(el=>el.year?el.id+";"+el.year: el.id);
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
					const aRoleList = this.aRoles.filter(el=>el.role==this.oRoleDragEntered.role);
					if(aRoleList.length>0) {
						// sql
						const sRoleId = aRoleList[0].id;
						const nRoleOrder = aRoleList[0].order;
						const aPers = aRoleList[0].persons.sort((a, b) => a.order-b.order).map(el=>el.id);
						
						const sPlayId = aRoleList[0].play;
						//const aRoles = this.aRoles.filter(el => el.play==sPlayId).sort((a,b)=>(a.order-b.order)).map((el, i) => ({id: el.year?el.id+";"+el.year: el.id, no: i}));
						const aRoles = this.aRolesFull
														.sort((a,b)=>(a.order-b.order))
														.map((el, i) => ({
															id: el.year?el.id+";"+el.year: el.id, 
															no: i
														}));
						
						//this.sendData("update", {reason: "roles_order", data: JSON.stringify(aRoles)});	
						this.sendData("update", {reason: "roles_order", data: aRoles.map(el=>el.id+"_"+el.no).join("|")});					
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
				
				this.sTmpDate = this.sSelectePlayYear;
			},
			showAddRole: function(){
				this.bRoleAddition = true;
			},
			addRole: function(){
				this.bRoleAddition = false;
				if(this.sNewRole.length || this.bNewRoleSpecial) {
					nMaxOrder = (this.aRolesFull.length>0) ? Number(this.aRolesFull[this.aRolesFull.length-1].order) + 1: 0;
					const pRolesUpdate = this.sendData("update", 
						{
							reason: "role", 
							no: nMaxOrder, 
							role: this.sNewRole, 
							role_sing: this.sNewRoleSing, 
							play_id: this.sSelectedPlay,
							role_type: this.bNewRoleSpecial? 2: 1
						});	
					this.sNewRole = "";
					pRolesUpdate.finally(function(){this.loadData();}.bind(this));
					// sql
				}
			},
				
			selectNewPerson: function(e, roleId){
				this.sTmpPerformer = e.target.value; // id
				
				/*/
				let oRole = this.aRoles.filter(item => item.id == roleId)[0];
				oRole.newSelected = e.target.value;
				
				let nMaxOrder = oRole.persons.length? oRole.persons.sort((a,b)=> b.order-a.order)[0].order : "0";
				if(oRole.persons.length == 0 || oRole.persons.filter(el=>el.id==oRole.newSelected).length<1) {
					oRole.persons.push({
						id: oRole.newSelected,
						order: nMaxOrder+1,
						year: this.sTmpDate
					});
					this.sendData("update", {reason: "pers_update", role_id: oRole.id, pers_id: oRole.persons.sort((a, b) => a.order-b.order).map(el => el.year?el.id+";"+el.year: el.id).join("|")});	
				}
				oRole.newVisible = false;	
				/**/
			},
			addPerformer :function(e, roleId){
				if(!this.sTmpPerformer) {
					alert("Не выбран исполнитель!");
					return;
				}
				if(!this.sTmpDate) {
					alert("Не выбрана дата!");
					return;
				}
				let oRole = this.aRoles.filter(item => item.id == roleId)[0];
				
				oRole.persons.push({
						id: this.sTmpPerformer,
						date: this.sTmpDate
					});
					
			  this.sendData("update", {
					reason: "performer_add", 
					role_id: oRole.id, 
					pers_id: this.sTmpPerformer,
					date: this.sTmpDate
				});	
				
				this.sTmpPerformer = "";
				this.sTmpDate = ""
				oRole.newVisible = false;
			},
			
			selectCurPers: function(e, roleId){
			    
			},
				
			removePerson: function(sPersId, sRoleId, bEdit){
				if(!bEdit){
					let oRole = this.aRoles.filter(item => item.id == sRoleId)[0];
					oRole.persons = oRole.persons.filter(item => item.id!=sPersId);
					// sql
					// this.sendData("update", {reason: "pers_update", role_id: oRole.id, pers_id: oRole.persons.sort((a, b) => b.order-a.order).map(el => el.year?el.id+";"+el.year: el.id).join("|")});	
					this.sendData("update", {
						reason: "performer_remove", 
						role_id: oRole.id, 
						pers_id: sPersId
					});	
				}				
			},
			editPerformer: function(sPersId, sRoleId, sDate){
				this.nTmpRoleEdit = sRoleId;
				this.nTmpPerfEdit = sPersId;
			},
			savePerformer: function({linkId, date}){
				this.sendData("update", {
					reason: "performer_edit", 
					link_id: linkId, 
					date: date
				});	
				
				this.nTmpRoleEdit = null;
				this.nTmpPerfEdit = null;
			},
			canselEditPerformer: function(bEdit){
				this.nTmpRoleEdit = null;
				this.nTmpPerfEdit = null;
			},
			removeRole: function(sRoleId){
				this.aRoles = this.aRoles.filter(el => el.id!=sRoleId);
				// sql
				this.sendData("update", {reason: "role_remove", role_id: sRoleId});	
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
				this.sendData("update", {reason: "role_update", role_id: oRole.id, role: oRole.role, role_sing: oRole.role_sing});	
			},			
			cancelRole: function(sRoleId){				
				const oRoleFormatted = this.aRoles.filter(el => el.id==sRoleId)[0];
				let oRole = this.aRoles.filter(el=>el.id==oRoleFormatted.id)[0];
				oRole.editVisible = false;
			},
			
			showNewPersonAdder: function(){
				this.bPersAdding = true;
				this.sNewName = "";
				this.sNewStat2 = "";
				this.sNewLink = "";
				this.sNewDate = "";
			},
			hideNewPersonAdder: function(){
				this.bPersAdding = false;
				this.sNewName = "";
				this.sNewStat2 = "";
				this.sNewLink = "";
				this.sNewDate = "";
			},
			addNewPerson: function(){
				const oPersAdd = this.sendData("update", {reason: "person_add", name: this.sNewName, stat2: this.sNewStat2, link: this.sNewLink, date: this.sNewDate});
				oPersAdd.finally(function(){this.loadData();}.bind(this));
			},
			
			onRolesTypeChanged: async function(sVal){
				//let sVal = this.bPlayRolesType;
				await this.sendData("update", {
					reason: "roles_type", 
					type: sVal, 
					play: this.sSelectedPlay
				});	
				this.loadData();
			},
			
			
			
			
			//--------------------------
			edit_person: function(oPerson, oParams){
				for (let key in this.pers_editor.info){
					this.pers_editor.info[key] = oPerson[key] || '';
				}
				for (let key in oParams){
					this.pers_editor.info[key] = oParams[key] || '';
				}
				
				if(oParams) {
					this.save_edited_person();
				}
			},
			
			save_edited_person: async function(){
				let sId = this.pers_editor.info.id;
				
				let oResp = await this.sendData("update", {reason: "person_info", "id": sId, 
					"name": this.pers_editor.info.name,
					"link": this.pers_editor.info.link,
					"stat": this.pers_editor.info.stat,
					"stat2": this.pers_editor.info.stat2,
					"date": this.pers_editor.info.date,
					"dk_code": this.pers_editor.info.dk_code,
					"show_in_koll": this.pers_editor.info.show_in_koll,
				});
				
				this.loadData();
			},
		
		
			//---------------
			
			generate_QRs: async function(){
				let aElements = document.querySelectorAll('.qr_place');
				
				aElements.forEach( async el => {
					el.innerHTML = '';
					let oCanvas = el;
					let sCode = el.dataset.dk_code;
					var qrcodjs = new QRCode(oCanvas, {
							text: sCode,
							width: 180,
							height: 180,
							colorDark: "#000000",
							colorLight: "#ffffff",
							correctLevel: QRCode.CorrectLevel.M
					});
				});
				
					
			},
			
			printPageArea: function(areaID){
				var printContent = document.getElementById(areaID);
				var WinPrint = window.open('', '', 'width=900,height=650');
				var cssHead = '<head><link rel="stylesheet" type="text/css" href="/coms/roles/roles_style.css"></head>'
				WinPrint.document.write(cssHead+printContent.innerHTML);
				WinPrint.document.close();
				WinPrint.focus();
				
				//setTimeout(WinPrint.print, 300);
				//WinPrint.print();
				//WinPrint.close();
			},
			
			print_QRs: function(){
				this.printPageArea('qr_for_print');
			},
		},
  });
});
