const apiKey = PropertiesService.getScriptProperties().getProperty("KEY")
const token = PropertiesService.getScriptProperties().getProperty("TOKEN")

function createTrelloCard(title, description, member, listName) {   

   const card = {
     name: title,
     desc: description,
     idList: listName,
     idMembers: member
   }

    const options = {
      method: 'POST',
      contentType: 'application/json',
      payload: JSON.stringify(card),
  };


  const request = UrlFetchApp.fetch(`https://api.trello.com/1/cards?idList=${listName}&key=${apiKey}&token=${token}`, options)
  const response = JSON.parse(request.getContentText())

  const data = {
    title: response.name,
    description: response.desc,
    memberID: response.id,
    listID: response.idList
  }

  return data
  
}

function moveTrelloCard( cardID, newList){

  const newData = {
    idList: newList
  }

  const options = {
    method: 'PUT',
    contentType: 'application/json',
    payload: JSON.stringify(newData),
};

  const request = UrlFetchApp.fetch(`https://api.trello.com/1/cards/${cardID}?key=${apiKey}&token=${token}`, options)
  const response = JSON.parse(request.getContentText())

  return response.idList

}

function deleteTrelloCard( cardID ){

  const options = {
    method: 'DELETE'
};

  const request = UrlFetchApp.fetch(`https://api.trello.com/1/cards/${cardID}?key=${apiKey}&token=${token}`, options)
  
  if(request.getResponseCode() == 200){
    Logger.log("card successfully deleted")

    const sheetID = "1orKN-pGofXtKYd_A41VefYSr3gp9FLWSeuwTl5RMPpI"
    const sheets = SpreadsheetApp.openById(sheetID).getActiveSheet();
    const range = sheets.getDataRange();

    const values = range.getValues();

    for (let row = 0; row < values.length; row++) {
      if (values[row][3] === cardID) {
        sheets.deleteRow(row + 1);
        break;
      }
    }
  }else{
    Logger.log("error deleting card" + request.getContentText())
  }

  return

}

function addNewRow(data){

  const sheetID = "1orKN-pGofXtKYd_A41VefYSr3gp9FLWSeuwTl5RMPpI"
  const sheets = SpreadsheetApp.openById(sheetID).getActiveSheet()

  const newRow = sheets.getLastRow() + 1
  sheets.getRange(newRow, 1).setValue(data.title)
  sheets.getRange(newRow, 2).setValue(data.description)
  sheets.getRange(newRow, 3).setValue(data.memberID)
  sheets.getRange(newRow, 4).setValue(data.listID)

  return
}

function updateList(card, newCard){
  const sheetID = "1orKN-pGofXtKYd_A41VefYSr3gp9FLWSeuwTl5RMPpI"
  const sheets = SpreadsheetApp.openById(sheetID).getActiveSheet()

  const range = sheets.getRange(1, 4, sheets.getLastRow(), 1);
  const values = range.getValues()

  for(let x = 0; x < values.length; x++){
    oldCard = values[x][0]

    if( oldCard === card ){
      sheets.getRange( x+1, 4).setValue(newCard)

      return 
    }
  }

}



