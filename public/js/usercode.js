function getNames() {
	var url = window.location.pathname;
	var code = url.substring(url.lastIndexOf('user'), url.lastIndexOf('user') + 14);
	result = code;

	switch (code) {
	case 'users16t01k16r':
		result = 'Stefan en Krisje';
		break;
	case 'usern16i01n16i':
		result = 'Nick en Nina';
		break;
	case 'userb16e01k16r':
		result = 'Bert en Kristel';
		break;
	case 'userd16i01g16r':
		result = 'Dirk en Greetje';
		break;
	case 'userw16o01e16l':
		result = 'Wouter en Ellen';
		break;
	case 'usern16i01c16o':
		result = 'Nico';
		break;
	case 'userm16i01i16s':
		result = 'Michaël en Isabelle';
		break;
	case 'userj16e01p16i':
		result = 'Jeffrey en Pili';
		break;
	case 'usert16o01c16h':
		result = 'Tom en Chrissy';
		break;
	case 'usere16r01v16e':
		result = 'Erik en Veronique';
		break;
	case 'userr16a01m16a':
		result = 'Raf en Mari';
		break;
	case 'users16i01n16e':
		result = 'Simon en Nele';
		break;
	case 'users16t01t16i':
		result = 'Muis en Tineke';
		break;
	case 'userg16a01n16n':
		result = 'Gannie';
		break;
	}
	document.getElementById("code").value = result;
}
