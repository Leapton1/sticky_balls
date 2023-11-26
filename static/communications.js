
function sendinfo(info){

    fetch(
        '/postman', 
        {
        method: 'POST',
        headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json'
        },
        // Strigify the payload into JSON:
        body:JSON.stringify(info)
        }
    ).then(res=>{
        if(res.ok) {
            return res.json();
        } else {
            alert('something is wrong');
        }
        }
    ).then(jsonResponse=>{

    // Log the response data in the console
    console.log(jsonResponse);
    // jsonResponse is the returned data, can use it for other functions
    } 
    ).catch((err) => console.error(err));

}

sendinfo("robert");