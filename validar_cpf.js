let selectedFile;
let valida_cpf;
let cpf_array;
let soma;
let resto;


function validarCPF(cpf) {	
    //let cpf;
    cpf = cpf.replace(/[^\d]+/g,"")
    
    if(cpf == '') return "CPF inválido";	
	// Elimina CPFs invalidos conhecidos	
	if (cpf.length != 11 || 
		cpf == "00000000000" || 
		cpf == "11111111111" || 
		cpf == "22222222222" || 
		cpf == "33333333333" || 
		cpf == "44444444444" || 
		cpf == "55555555555" || 
		cpf == "66666666666" || 
		cpf == "77777777777" || 
		cpf == "88888888888" || 
		cpf == "99999999999")
			return "CPF inválido";		
	// Valida 1o digito	
	add = 0;	
	for (i=0; i < 9; i ++)		
		add += parseInt(cpf.charAt(i)) * (10 - i);	
		rev = 11 - (add % 11);	
		if (rev == 10 || rev == 11)		
			rev = 0;	
		if (rev != parseInt(cpf.charAt(9)))		
			return "CPF inválido";		
	// Valida 2o digito	
	add = 0;	
	for (i = 0; i < 10; i ++)		
		add += parseInt(cpf.charAt(i)) * (11 - i);	
	rev = 11 - (add % 11);	
	if (rev == 10 || rev == 11){
        rev = 0;
    }	
	if (rev != parseInt(cpf.charAt(10))){
        return "CPF inválido";
    }		
	return "CPF válido";   
};

function lerArquivo(){	
    if(selectedFile){
        fileReader = new FileReader();
        let cpf_array = [];
        let valida_cpf = [];
        let dados = [];
        let tamanho_array;
        let data_to_excel;
        let wb;
        let ws;
        let sit = [];
        let objeto_dados = {};
        excel_data = [];

        fileReader.readAsBinaryString(selectedFile);
        fileReader.onload = (event)=>{
            let data =  event.target.result;
            let workbook = XLSX.read(data, {type:"binary"});
            workbook.SheetNames.forEach(sheet => {
                let rowObjet = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet]);
                let cpf_objeto =XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
                let filename = "cpf.xlsx"
                tamanho_array = cpf_objeto.length;
                for (i=0; i< tamanho_array; i++){
                    cpf_array.push(cpf_objeto[i]["cpf"]);
                }
                for (j=0; j< tamanho_array; j++){
                    sit.push(validarCPF(cpf_objeto[j]["cpf"]));
                }
                for (k=0; k< tamanho_array; k++){
                    dados.push([[cpf_array[k]],[sit[k]]]);
                    objeto_dados = {"cpf":cpf_array[k], "situação":sit[k]}
                    excel_data.push(objeto_dados);
                }
                data_to_excel = excel_data.map(function(record){                   
                    return record;
                });
                wb = XLSX.utils.book_new();
                ws = XLSX.utils.json_to_sheet(data_to_excel);
                XLSX.utils.book_append_sheet(wb, ws, "cpf");
                XLSX.writeFile(wb, "Validacao CPF.xlsx");  
            });
        }               
    }
};
document.getElementById("upload-xls").addEventListener("change",(event)=>{
    selectedFile = event.target.files[0];
});

document.getElementById("btn-upload-xls").addEventListener("click", ()=>{
    lerArquivo();
});
