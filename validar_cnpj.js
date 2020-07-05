function validarCNPJ(cnpj) {
 
    cnpj = cnpj.replace(/[^\d]+/g,"");
    console.log(cnpj);
 
    if(cnpj == '') return "CNPJ Inválido"; //return "CNPJ Inválido";
     
    if (cnpj.length != 14)
        return "CNPJ Inválido";
 
    // Elimina CNPJs invalidos conhecidos
    if (cnpj == "00000000000000" || 
        cnpj == "11111111111111" || 
        cnpj == "22222222222222" || 
        cnpj == "33333333333333" || 
        cnpj == "44444444444444" || 
        cnpj == "55555555555555" || 
        cnpj == "66666666666666" || 
        cnpj == "77777777777777" || 
        cnpj == "88888888888888" || 
        cnpj == "99999999999999")
        return "CNPJ Inválido";
         
    // Valida DVs
    tamanho = cnpj.length - 2
    numeros = cnpj.substring(0,tamanho);
    digitos = cnpj.substring(tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0))
        return "CNPJ Inválido";
         
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0,tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1))
          return "CNPJ Inválido";
           
    return "CNPJ Válido";
    
};

function lerArquivo(){	
    if(selectedFile){
        fileReader = new FileReader();
        let cnpj_array = [];
        let valida_cnpj = [];
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
                let cnpj_objeto =XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
                let filename = "cnpj.xlsx"
                tamanho_array = cnpj_objeto.length;
                for (i=0; i< tamanho_array; i++){
                    cnpj_array.push(cnpj_objeto[i]["CNPJ"]);
                }
                for (j=0; j< tamanho_array; j++){
                    sit.push(validarCNPJ(cnpj_objeto[j]["CNPJ"]));
                }
                for (k=0; k< tamanho_array; k++){
                    dados.push([[cnpj_array[k]],[sit[k]]]);
                    objeto_dados = {"CNPJ":cnpj_array[k], "SITUAÇÃO":sit[k]}
                    excel_data.push(objeto_dados);
                }

                data_to_excel = excel_data.map(function(record){                   
                    return record;
                });
                wb = XLSX.utils.book_new();
                ws = XLSX.utils.json_to_sheet(data_to_excel);
                XLSX.utils.book_append_sheet(wb, ws, "CNPJ");
                XLSX.writeFile(wb, "Validacao CNPJ.xlsx");
                
            });
        }               
    }
};
document.getElementById("upload-cnpj-xls").addEventListener("change",(event)=>{
    selectedFile = event.target.files[0];
});

document.getElementById("btn-upload-cnpj-xls").addEventListener("click", ()=>{
    lerArquivo();
});
/*
document.getElementById("btn-download-xls").addEventListener("click", ()=>{
    criarArquivo();
});*/