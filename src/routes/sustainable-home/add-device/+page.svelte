<script>
	import vector_login from '$lib/images/vector-login.png';
	import logo from '$lib/images/logo-sustainify.png';
	import placeholder from '$lib/images/image-placeholder.svg';
	import lamp from '$lib/images/lamp-example.png';
	import loading from '$lib/images/loading.gif';
	import { onMount, afterUpdate } from 'svelte';
	import {rldb, strg, frdb} from "$lib/firebaseConfig.js"; 
	import {doc, setDoc, getDocs, collection, deleteDoc, getDoc, updateDoc } from "firebase/firestore"; 
	import { ref as ref_storage, uploadBytesResumable, getDownloadURL } from "firebase/storage";
	import { getDatabase, ref as ref_database , push, set, onValue, update } from 'firebase/database';
	import {fly, scale} from 'svelte/transition'
	import Navbar from '$lib/components/navbar.svelte';

	let hidden_state = 0;
	let overflow = null;
	let device_name = null;
	let device_category = "Priority";
	let device_picture = null;
	let messageModal = 0;
	let messageModalSuccess = 0;
	let messagePayload = null;
	let realButton = null;
    let copyButton = null;
    let realButton2 = null;
    let copyButton2 = null;
    let imgReal = null;
    let devices = [];
    let uploadProgress = 0;	
    let uploaded = 0;
    let done_all_progress = 0;
    let discover_device = 0;
    let device_found = 0;
    let device_max = 0;
    const update_user_status = {};
    let month_year_list = [];
	const monthNames = ["January", "February", "March", "April", "May", "June",
	  "July", "August", "September", "October", "November", "December"
	];
	let dateObj = new Date();
	let month = dateObj.getUTCMonth();
	let day = dateObj.getUTCDate();
	let year = dateObj.getUTCFullYear();
	const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
	const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png'];


	function isOverflowY(element) {
	  return element.scrollHeight != Math.max(element.offsetHeight, element.clientHeight)
	}

	let getAllDevice = async () => {
		const refList = ref_database(rldb, `devices/${localStorage.getItem("username")}`);
		onValue(refList, (snapshot) => {
			const data = snapshot.val();
			if (data != null) {
				devices = Object.keys(data)
			}
		})
	}

	let addDevice = (device_name,device_category,device_picture,user_id) => {
		if (!ALLOWED_FILE_TYPES.includes(device_picture.type)) {
			messageModal = 1;
			messagePayload = "Only jpg and png files are allowed.";
			return;
		}
		if (device_picture.size > MAX_FILE_SIZE) {
			messageModal = 1;
			messagePayload = "File size should not exceed 2MB.";
			return;
		}
		uploaded = 1;
		discover_device = 1;	
		const storageRef = ref_storage(strg, `device_images/${device_picture.name}`);
    	const uploadTask = uploadBytesResumable(storageRef, device_picture);
		const message = 
				  'M-SEARCH * HTTP/1.1\r\n' +
				  'HOST: 239.255.255.250:1982\r\n' +
				  'MAN: "ssdp:discover"\r\n' +
				  'ST: wifi_bulb\r\n';
        // const socket = new WebSocket('wss://sustainify-ws.glitch.me');
  		const socket = new WebSocket('https://gibbon-special-hookworm.ngrok-free.app/');
	    socket.onopen = () => {
	      socket.send(message);
	    };

	    socket.onmessage = async (event) => {
	      const message = event.data;
	      if (message.includes('yeelight')) {
	      	discover_device = 0;
	        const lampId = message.match(/id:\s*(0x[0-9a-fA-F]+)/)[1];
	        const ip = message.match(/Location: yeelight:\/\/([\d.]+):(\d+)/)[1];
	        const port = message.match(/Location: yeelight:\/\/([\d.]+):(\d+)/)[2];
	        
	        if (!devices.includes(lampId)) {
	        	if (devices.length < 10) {
	        		try {
						uploadTask.on(
					      'state_changed',
					      (snapshot) => {
					        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					        uploadProgress = progress
					      },
					      (error) => {
					        console.error('Upload failed', error);
					    },
					    async () => {
							getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
								await set(ref_database(rldb, `devices/${user_id}/${lampId}`), {
						            ip: ip,
						            port: port,
						            name: device_name,
						            category: device_category,
						            image: downloadURL,
						            state: 'on'
						          });
								const queryCarbon = await getDocs(collection(frdb, "users", localStorage.getItem("username"), "carbon-record"));
								const documentsCarbon = queryCarbon.docs;
          						const documentsLengthCarbon = documentsCarbon.length;
								if (documentsLengthCarbon == 0) {
									update_user_status[`devices/${localStorage.getItem("username")}/status`] = "unsuspended";
									update(ref_database(rldb), update_user_status)
								} else if(documentsLengthCarbon == 1){
						          	 for (var x = 0; x < documentsLengthCarbon; x++) {
						          	 	let param = ((documentsCarbon[x].data().home_electricity / documentsCarbon[x].data().carbon_total) * 100).toFixed(1)
						              	if (param > 50) {
						              		update_user_status[`devices/${localStorage.getItem("username")}/status`] = "suspended";
											update(ref_database(rldb), update_user_status)
						              	} else {
						              		update_user_status[`devices/${localStorage.getItem("username")}/status`] = "unsuspended";
											update(ref_database(rldb), update_user_status)
						              	}
							         }
								} else {
									const getDataCarbonOld = await getDoc(collection(frdb, "users", username, "carbon-record", monthNames[month-1]+"-"+year));
									const getDataCarbonNew = await getDoc(collection(frdb, "users", username, "carbon-record", monthNames[month]+"-"+year));
									let param1 = ((getDataCarbonOld.data().home_electricity / getDataCarbonOld.data().carbon_total) * 100).toFixed(1)
									let param2 = ((getDataCarbonNew.data().home_electricity / getDataCarbonNew.data().carbon_total) * 100).toFixed(1)
									if (param1 > 50 || param2 > 50) {
					              		update_user_status[`devices/${localStorage.getItem("username")}/status`] = "suspended";
										update(ref_database(rldb), update_user_status)
					              	} else {
					              		update_user_status[`devices/${localStorage.getItem("username")}/status`] = "unsuspended";
										update(ref_database(rldb), update_user_status)
					              	}
								}
							devices.push(lampId);
							done_all_progress = 1;
					        });
						})
					} catch(error) {
						console.log(error)
					}
	        	} else {
	        		device_max = 1;
	        	}
	        } else {
	        	device_found = 1;
	        }
	      }
	    };

	    socket.onerror = (error) => {
	      console.error('WebSocket Error:', error);
	    };
	}

	function readURLA(input) {
	    if (input.files && input.files[0]) {
	        var reader = new FileReader();
	        reader.onload = function (e) {
	            window.$('#img-device-preview').attr('src', e.target.result);
	        }

	        reader.readAsDataURL(input.files[0]);
	    }
	}

	function readURLB(input) {
	    if (input.files && input.files[0]) {
	        var reader = new FileReader();
	        reader.onload = function (e) {
	            window.$('#img-device-preview2').attr('src', e.target.result);
	        }

	        reader.readAsDataURL(input.files[0]);
	    }
	}

	const goToSustainableHome = () => {
		window.location.href = '/sustainable-home'
	}

	onMount(async() => {
		// getUserIds();
		if (localStorage.getItem("email") == "" || localStorage.getItem("email") == null) {
			window.location.href = '/'
		} else if (localStorage.getItem("username") == "" || localStorage.getItem("username") == null) {
			window.location.href = '/'
		}
		realButton = document.querySelector("#add-device-pic");
    	copyButton = document.querySelector("#btn-device-pic");
    	if (copyButton) {
		     copyButton.addEventListener("click", function(event) {
		      realButton.click();
		    })
	 	}
	 	realButton2 = document.querySelector("#add-device-pic2");
    	copyButton2 = document.querySelector("#btn-device-pic2");
    	if (copyButton2) {
		     copyButton2.addEventListener("click", function(event) {
		      realButton2.click();
		    })
	 	}
	 	await getAllDevice();
	})

	$: progress = uploadProgress;
	$: if (uploaded == 1 && discover_device == 1) messageModalSuccess = 1
	$: if (uploaded == 1 && discover_device == 1) messagePayload = "Discovering Device"
	$: if (progress != 100 && uploaded == 1 && discover_device == 0) messagePayload = "Adding Device"
	$: if (uploaded == 1 && discover_device == 0 && device_found == 1) messageModal = 1
	$: if (uploaded == 1 && discover_device == 0 && device_found == 1) messageModalSuccess = 0
	$: if (uploaded == 1 && discover_device == 0 && device_found == 1) messagePayload = "Device was already added before"
	$: if (uploaded == 1 && discover_device == 0 && device_max == 1) messageModal = 1
	$: if (uploaded == 1 && discover_device == 0 && device_max == 1) messageModalSuccess = 0
	$: if (uploaded == 1 && discover_device == 0 && device_max == 1) messagePayload = "Maximum number of devices has been reached (10)"
	$: if (progress == 100 && uploaded == 1 && discover_device == 0) messagePayload = "Device added succesfully"
	$: if (progress == 100 && uploaded == 1 && done_all_progress == 1 && discover_device == 0) goToSustainableHome();
</script>

<svelte:head>
	<title>Sustainable Home</title>
	<meta name="description" content="Sustainable Home Page" />
</svelte:head>

{#if messageModal == 1}
<div class="mobile">
	<div class="modal-backdrop" in:fly={{ y: -20, duration: 600 }}>
		<div class="flex flex-center-vertical flex-center-horizontal h-100">
			<div class="card w-80 flex flex-direction-col flex-gap-semi-large flex-center-vertical flex-center-horizontal">
				<div class="head-input-primary text-center">{messagePayload}</div>
				<button class="btn-modal w-100" on:click={() => {
					messageModal = 0
				}}>Close</button>
			</div>
		</div>
	</div>
</div>
<div class="desktop desktop-fix">
	<div class="modal-backdrop" in:fly={{ y: -20, duration: 600 }}>
		<div class="flex flex-center-vertical flex-center-horizontal h-100">
			<div class="card w-25 flex flex-direction-col flex-gap-semi-large flex-center-vertical flex-center-horizontal">
				<div class="head-input-primary text-center">{messagePayload}</div>
				<button class="btn-modal w-100" on:click={() => {
					messageModal = 0
				}}>Close</button>
			</div>
		</div>
	</div>
</div>
{/if}

{#if messageModalSuccess == 1}
<div class="mobile">
	<div class="modal-backdrop" in:fly={{ y: -20, duration: 600 }}>
		<div class="flex flex-center-vertical flex-center-horizontal h-100">
			<div class="card w-80 flex flex-direction-col flex-gap-regular flex-center-vertical flex-center-horizontal">
				<div class="head-input-primary text-center">{messagePayload}</div>
				<div class="flex flex-direction-col flex-gap-semi-large flex-center-vertical">
					<div class="loading-text text-center">Please wait a moment</div>
					<img src="{loading}" class="w-30">
				</div>
			</div>
		</div>
	</div>
</div>
<div class="desktop desktop-fix">
	<div class="modal-backdrop" in:fly={{ y: -20, duration: 600 }}>
		<div class="flex flex-center-vertical flex-center-horizontal h-100">
			<div class="card w-25 flex flex-direction-col flex-gap-regular flex-center-vertical flex-center-horizontal">
				<div class="head-input-primary text-center">{messagePayload}</div>
				<div class="flex flex-direction-col flex-gap-semi-large flex-center-vertical">
					<div class="loading-text text-center">Please wait a moment</div>
					<img src="{loading}" class="w-30">
				</div>
			</div>
		</div>
	</div>
</div>
{/if}

<div class="mobile">
	<section class="bg-secondary vw-100 vh-100 flex flex-direction-col page-pad">
		<Navbar pagePointer="sustainable-home"/>
		<div class="vw-100 h-10 flex flex-center-vertical page-top">
			<div class="flex flex-between-horizontal flex-center-vertical">
				<i class="fa-solid fa-arrow-left arrow-back" on:click={() => {
					history.back();
				}}></i>
				<img src="{logo}" alt="" class="w-50">
			</div>
		</div>
		<div class="bg-primary vw-100 h-fit template-home-bg flex flex-direction-col flex-gap-large" id="form-login">
			<div class="flex flex-direction-col flex-gap-semi-large">
				<div class="flex flex-direction-col flex-gap-regular flex-center-vertical flex-center-horizontal">
					<div class="form-note w-100 flex flex-gap-semi-small flex-direction-col flex-center-vertical flex-center-horizontal">
						<div>Please read this instruction!</div>
						<ul class="flex flex-direction-col flex-gap-semi-small">
							<li class="line-controller">Upon first attempt registering your smart device, please connect the smart device and your smartphone/laptop/computer to the same wireless network (Wi-Fi)</li>
							<li class="line-controller">Please wait for 5 to 10 seconds for the smart device to be found</li>
							<li class="line-controller">After the device is registered, you can use other network on your smartphone/laptop/computer and control your smart device anytime and anywhere</li>
						</ul>
					</div>
				</div>
				<div class="flex flex-direction-col flex-gap-regular">
					<div class="head-input-secondary">Device Name</div>
					<input type="text" name="" class="input-field w-100" placeholder="input device name.." bind:value={device_name}>
				</div>
				<div class="flex flex-direction-col flex-gap-regular">
					<div class="head-input-secondary"><label for="device-category">Device Category</label></div>
					<select class="select-1" bind:value={device_category} id="device-category">
						<option>Priority</option>
						<option>Non Priority</option>
					</select>
				</div>
				<div class="flex flex-direction-col flex-gap-regular">
					<div class="head-input-secondary">Device Picture</div>
					<div class="head-input-accent padding-accent">Please input landscape picture</div>
					<input type="file" hidden="hidden" name="" id="add-device-pic" on:change={(e) => {
						device_picture = e.target.files[0]
	       				 readURLA(realButton);
	       				 overflow = isOverflowY(document.getElementById("form-login"))
						console.log(overflow)
					}}>
					<button class="btn-secondary w-100" id="btn-device-pic">Add Media</button>
					<img src="{placeholder}" class="w-100 img-device-preview" id="img-device-preview" alt="">
				</div>
				<div class="flex flex-direction-col flex-gap-semi-large padding-btn-login">
					<button class="btn-secondary w-100" on:click={() => {
						if (device_name == "" || device_name == null) {
							messageModal = 1;
							messagePayload = "Please fill the device name";
						} else if (device_category == "" || device_category == null) {
							messageModal = 1;
							messagePayload = "Please fill your caption";
						} else if (device_picture == "" || device_picture == null) {
							messageModal = 1;
							messagePayload = "Please insert device picture";
						} else {
							addDevice(device_name,device_category,device_picture,localStorage.getItem("username"));
						}
					}}>Add Device</button>
				</div>
			</div>
		</div>
	</section>
</div>
<div class="desktop flex flex-center-horizontal">
	<section class="bg-secondary w-30 h-100 flex flex-direction-col page-pad relative">
		<Navbar pagePointer="sustainable-home"/>
		<div class="w-100 h-10 flex flex-center-vertical page-top missions-home">
			<div class="flex flex-between-horizontal flex-center-vertical">
				<i class="fa-solid fa-arrow-left arrow-back" on:click={() => {
					history.back();
				}}></i>
				<img src="{logo}" alt="" class="w-50">
			</div>
		</div>
		<div class="bg-primary w-100 h-90 template-home-bg flex flex-direction-col flex-gap-large missions-home" id="form-login">
			<div class="flex flex-direction-col flex-gap-semi-large">
				<div class="flex flex-direction-col flex-gap-regular flex-center-vertical flex-center-horizontal">
					<div class="form-note w-100 flex flex-gap-semi-small flex-direction-col flex-center-vertical flex-center-horizontal">
						<div>Please read this instruction!</div>
						<ul class="flex flex-direction-col flex-gap-semi-small">
							<li class="line-controller">Upon first attempt registering your smart device, please connect the smart device and your smartphone/laptop/computer to the same wireless network (Wi-Fi)</li>
							<li class="line-controller">Please wait for 5 to 10 seconds for the smart device to be found</li>
							<li class="line-controller">After the device is registered, you can use other network on your smartphone/laptop/computer and control your smart device anytime and anywhere</li>
						</ul>
					</div>
				</div>
				<div class="flex flex-direction-col flex-gap-regular">
					<div class="head-input-secondary">Device Name</div>
					<input type="text" name="" class="input-field w-100" placeholder="input device name.." bind:value={device_name}>
				</div>
				<div class="flex flex-direction-col flex-gap-regular">
					<div class="head-input-secondary"><label for="device-category">Device Category</label></div>
					<select class="select-1" bind:value={device_category} id="device-category">
						<option>Priority</option>
						<option>Non Priority</option>
					</select>
				</div>
				<div class="flex flex-direction-col flex-gap-regular">
					<div class="head-input-secondary">Device Picture</div>
					<div class="head-input-accent padding-accent">Please input landscape picture</div>
					<input type="file" hidden="hidden" name="" id="add-device-pic2" on:change={(e) => {
						device_picture = e.target.files[0]
	       				 readURLB(realButton2);
	       				 overflow = isOverflowY(document.getElementById("form-login"))
						console.log(overflow)
					}}>
					<button class="btn-secondary w-100" id="btn-device-pic2">Add Media</button>
					<img src="{placeholder}" class="w-100 img-device-preview" id="img-device-preview2" alt="">
				</div>
				<div class="flex flex-direction-col flex-gap-semi-large padding-btn-login">
					<button class="btn-secondary w-100" on:click={() => {
						if (device_name == "" || device_name == null) {
							messageModal = 1;
							messagePayload = "Please fill the device name";
						} else if (device_category == "" || device_category == null) {
							messageModal = 1;
							messagePayload = "Please fill your caption";
						} else if (device_picture == "" || device_picture == null) {
							messageModal = 1;
							messagePayload = "Please insert device picture";
						} else {
							addDevice(device_name,device_category,device_picture,localStorage.getItem("username"));
						}
					}}>Add Device</button>
				</div>
			</div>
		</div>
	</section>
</div>
