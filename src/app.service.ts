import { Injectable } from '@nestjs/common';
import { PDFDocument } from 'pdf-lib';
import { readFile } from 'fs/promises';
import { writeFile } from 'fs/promises';
import { dirname } from 'path';;

@Injectable()
export class AppService {
  getHello(): object {
    return {
      hello: 'hello world'
    };
  }

  async createPdf(input) {
    const path = dirname('E:/projects/BFF/pdf-editor-21-01-24/example.pdf');

    try{
      const pdfDoc = await PDFDocument.load(await readFile(`${path}/${input}`));
      const form = pdfDoc.getForm();
      let fieldNames = pdfDoc.getForm().getFields();

      let specificFieldNameArray = [];
      let specificFieldNameValueArray = [];

      fieldNames.map((f) => {
        let specificFieldName = f.getName();

        if(f.constructor.name ===  "PDFTextField"){
          specificFieldNameValueArray.push(form.getTextField(specificFieldName).getText())
        }else if (f.constructor.name  === "PDFRadioGroup"){
          specificFieldNameValueArray.push(form.getRadioGroup(specificFieldName).getSelected())
        }
        
        specificFieldNameArray.push(specificFieldName)
      });
    
      return {
        'specificFieldNameArray': specificFieldNameArray,
        'specificFieldNameValueArray': specificFieldNameValueArray
      };
    
    } catch (error) {
      return error
    }
  };

  async savePdf(body){
    const path = dirname('E:/projects/BFF/pdf-editor-21-01-24/example.pdf');

    const pdfDoc = await PDFDocument.load(await readFile(`${path}/example.pdf`));
    const form = pdfDoc.getForm();
    const fieldNames = pdfDoc.getForm().getFields();

    body?.forEach((element, index) => {
      let fieldName = fieldNames[index];
      if(element?.value){
        if(fieldName.constructor.name === "PDFTextField"){
          form.getTextField(element?.key).setText(`${element?.value}_TX`);
        }else if (fieldName.constructor.name === "PDFRadioGroup"){
          form.getRadioGroup(element?.key).select(element?.value);
        }else{
          /** we can write code for other fields, if any */
        }
      }
    });

    const pdfBytes = await pdfDoc.save();

    await writeFile('E:/projects/BFF/pdf-editor-21-01-24/editedExample.pdf', pdfBytes);
    return "data saved successfully"
  }
}
