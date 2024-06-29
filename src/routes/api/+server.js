import { error } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import {frdb, strg} from "$lib/firebaseConfig.js";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {doc, setDoc, getDocs, collection } from "firebase/firestore"; 

export async function GET(event) {
	setDoc(doc(frdb, "tests", "test_1"), {test:"test"})
	// const companyDetails = {
	// 	name: 'My Company',
	// 	employees: [
	// 		{ name: 'John Doe', salary: 45000 },
	// 		{ name: 'Jane Larkin', salary: 42000 },
	// 		{ name: 'Jim Salmon', salary: 38000 }
	// 	],
	// 	customers: [
	// 		{ name: 'Bills Toys Inc', income: 30000 },
	// 		{ name: 'Silly Co', income: 25000 },
	// 		{ name: 'Rox R Us', income: 20000 }
	// 	]
	// };

	return json({test:"test"});
}