

const dataUrl = 'https://data.crawfish92.hasura-app.io/v1/query';
const loginUrl = 'https://auth.crawfish92.hasura-app.io/v1/login';
const signupUrl = 'https://auth.crawfish92.hasura-app.io/v1/signup';
const bearerToken = 'Bearer 63c36030befd4944c0426a0c515739c1e1862695c24981db';

import { Alert, AsyncStorage } from 'react-native';
// import fetch from 'isomorphic-fetch'
// // Fixes isomorphic-fetch
// GLOBAL.self = GLOBAL;
const networkErrorObj = {
  status: 503
}

export async function trySignupAndInsert(phone,otp) {
//   console.log('Making signup query');
// const signUpUrl='https://app.course77.hasura-app.io/signupotp?mobile='+ phone + '&country_code=91&otp=' + otp;
// console.log(signUpUrl);
// fetch(signUpUrl).then(function(response) {  console.log(response);	return response.json();})
// .then(function(result) {
// 	console.log(result);
// 	// To save the auth token received to offline storage
// 	var authToken = result.auth_token;
//   var userid = result.hasura_id;
//   AsyncStorage.setItem('HASURA_AUTH_TOKEN', authToken);
//   AsyncStorage.setItem('userId',userid);
//   this.insertUser(phone,userid)
//   .then(function(response) { return response; });
// })
// .catch(function(error) {
// 	console.log('Request Failed:' + error);
// });

    var requestOptions = {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json"
        }
    };

    var body = {
        "provider": "mobile",
        "data": {
            "mobile": phone,
            "country_code": "91",
            "otp": otp
        }
    };

    requestOptions.body = JSON.stringify(body);
    try {
      await fetch(signupUrl, requestOptions)
      .then(function(response) {
          console.log(response);
          return response.json();
        })
        .then(function(result) {
          console.log('after signup');
          console.log(result);
          // To save the auth token received to offline storage
          var authToken = result.auth_token;
          console.log('auth token');
          console.log(authToken);
          AsyncStorage.setItem('HASURA_AUTH_TOKEN', authToken);
          AsyncStorage.setItem('user_id', result.hasura_id);
          AsyncStorage.setItem('mobilenumber', phone);

        
          var insertBody = {
              "type": "insert",
              "args": {
                  "table": "users",
                  "objects": [
                      {
                          "mobilenumber": phone,
                          "displayname": "Test3",
                          "displaypic": null,
                          "status": "Hellloo!!",
                          "lastseen": null,
                          "deviceimei": "123123",
                          "user_id": "103"
                      }
                  ]
              }
          };

          requestOptions.body = JSON.stringify(insertBody);
          // make a 2nd request and return a promise
          return fetch(dataUrl, requestOptions)
        })
        .then(function(response) {
            console.log('after insert');
            console.log(response);
            return response ;
        })
      }      
  catch(e) {
  console.log("Request Failed: " + e);
  return networkErrorObj;
  }
}

export async function insertUser(phone,userid) {
    let requestOptions = {
        "method": "POST",
        "headers": {
          "Content-Type":"application/json",
         //for appeal34 "Authorization": "Bearer b14ba9dff8d3de803387f4740de61585b44244d93783e0e0"
        //for defective95 "Authorization": "Bearer bd69be047e89fb3ac98e788222ee2a56547be1b35ef14fd3"
        "Authorization": 'Bearer 63c36030befd4944c0426a0c515739c1e1862695c24981db'
        }
    };

    var insertBody = {
        "type": "insert",
        "args": {
            "table": "users",
            "objects": [
                {
                    "mobilenumber": phone,
                    "displayname": "dfdd", 
                    "displaypic": null,
                    "status": "Hellloo!!",
                    "lastseen": null,
                    "deviceimei": "123123",
                    "user_id": userid, 
                }
            ]
        }
    };
    console.log(JSON.stringify(insertBody));

    requestOptions.body = JSON.stringify(insertBody);
    try {
    // make a 2nd request and return a promise
    return fetch(dataUrl, requestOptions)
    .then(function(response) {
        console.log(response.status);
        console.log(response.statusText);
          return response;
    });
    }        
    catch(e) {
        console.log("Request Failed: " + e);
    return networkErrorObj;
    }
};

export async function sendOtpUser(phone) {
  // try {
     console.log('Making sendOtpUser query');
  
  var url = "https://auth.crawfish92.hasura-app.io/v1/providers/mobile/send-otp";

var requestOptions = {
    "method": "POST",
    "headers": {
        "Content-Type": "application/json"
    }
};

var body = {
    "mobile": phone,
    "country_code": "91"
};

requestOptions.body = JSON.stringify(body);
try {
  let resp = await fetch(url, requestOptions);
  return resp; 
}
catch(e) {
  console.log("Request Failed: " + e);
  return networkErrorObj;
}
};


export async function updateUser(mobilenumber, displayname, displaypic, status) {
    console.log('updating User query');
  
    // If you have the auth token saved in offline storage, obtain it in async componentDidMount
    // var authToken = await AsyncStorage.getItem('HASURA_AUTH_TOKEN');
    // And use it in your headers
    // headers = { "Authorization" : "Bearer " + authToken }
    var requestOptions = {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
            //for defective95 "Authorization": "Bearer bd69be047e89fb3ac98e788222ee2a56547be1b35ef14fd3"
            "Authorization": bearerToken
        }
    };
    
    var body = {
        "type": "update",
        "args": {
            "table": "users",
            "where": {
                "mobilenumber": {
                    "$eq": mobilenumber
                }
            },
            "$set": {
                "displayname": displayname,
                "status": status,
                "displaypic": displaypic
            }
        }
    };
    
    requestOptions.body = JSON.stringify(body);
    
    try {
        let resp = await fetch(dataUrl, requestOptions);
        return resp; 
      }
      catch(e) {
        console.log("Request Failed: " + e);
        return networkErrorObj;
      }
}

export async function getContacts(user_id) {
	console.log('Making data query (get contacts)');
    // If you have the auth token saved in offline storage, obtain it in async componentDidMount
    // var authToken = await AsyncStorage.getItem('HASURA_AUTH_TOKEN');
    // And use it in your headers
    // headers = { "Authorization" : "Bearer " + authToken }
    var requestOptions = {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": bearerToken
        }
    };
    
    var body = {
        "type": "select",
        "args": {
            "table": "users",
            "columns": [
                "*"
            ],
            "where": {
                "user_id": {
                    "$ne": user_id
                }
            }
        }
    };
    
    requestOptions.body = JSON.stringify(body);
    
    try {
        let resp = await fetch(dataUrl, requestOptions);
        console.log(resp);
        return resp.json(); 
      }
      catch(e) {
        console.log("Request Failed: " + e);
        return networkErrorObj;
      }
};

export async function getUser(mobilenumber) {
  console.log('Making data query (get user)');
  
  var requestOptions = {
      "method": "POST",
      "headers": {
        "Content-Type": "application/json",
        //  "Authorization": "Bearer bd69be047e89fb3ac98e788222ee2a56547be1b35ef14fd3"
        "Authorization": bearerToken
   
    }
  }; 
  var body = {
      "type": "select",
      "args": {
          "table": "users",
          "columns": [
              "*"
          ],
          "where": {
              "mobilenumber": {
                  "$eq": mobilenumber
              }
          }
      }
  }; 
  requestOptions.body = JSON.stringify(body); 
  try {
    let resp = await fetch(dataUrl, requestOptions);
    console.log(resp);
    return resp.json(); 
  }
  catch(e) {
    console.log("Request Failed: " + e);
    return networkErrorObj;
  }
};

export async function getUserFromId(user_id) {
    console.log('Making data query (get user)');
  
    var requestOptions = {
        "method": "POST",
        "headers": {
          "Content-Type": "application/json",
          "Authorization": bearerToken
     
      }
    }; 
    var body = {
        "type": "select",
        "args": {
            "table": "users",
            "columns": [
                "*"
            ],
            "where": {
                "user_id": {
                    "$eq": user_id
                }
            }
        }
    }; 
    requestOptions.body = JSON.stringify(body); 
    try {
      let resp = await fetch(dataUrl, requestOptions);
      console.log(resp);
      return resp.json(); 
    }
    catch(e) {
      console.log("Request Failed: " + e);
      return networkErrorObj;
    }
};
  
export async function getLastMessages(user_id) {
    console.log('Making data query (get user)');
  
    var url = "https://data.crawfish92.hasura-app.io/v1/query";

    // If you have the auth token saved in offline storage, obtain it in async componentDidMount
    // var authToken = await AsyncStorage.getItem('HASURA_AUTH_TOKEN');
    // And use it in your headers
    // headers = { "Authorization" : "Bearer " + authToken }
    var requestOptions = {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": "Bearer 6367e4fc89e80a142071170876248bf65157081698930b18"
        }
    };

    const sqlquery = "SELECT DISTINCT ON (friend_id) * FROM (   SELECT 'out' AS type, msg_id, receiver_id AS friend_id, msg_text, sent_time, recd_time  FROM   messages  WHERE  sender_id = "+user_id+" UNION  ALL    SELECT 'in' AS type, msg_id, sender_id AS friend_id, msg_text, sent_time,recd_time FROM   messages WHERE  receiver_id = "+user_id+" ) sub ORDER BY friend_id, sent_time DESC;"
    //"SELECT DISTINCT ON (friend_id) * FROM (SELECT 'out' AS type, msg_id, receiver_id AS friend_id, msg_text, sent_time, recd_time FROM messages WHERE sender_id = 1 UNION ALL SELECT 'in' AS type, msg_id, sender_id AS friend_id, msg_text, sent_time, recd_time FROM messages WHERE  receiver_id = 1) sub ORDER BY friend_id, sent_time DESC;"
    var body = {
        "type": "run_sql",
        "args": {
            "sql": sqlquery
        }
    };

    requestOptions.body = JSON.stringify(body);

    try {
        let resp = await fetch(dataUrl, requestOptions);
        console.log(resp);
        return resp.json(); 
      }
      catch(e) {
        console.log("Request Failed: " + e);
        return networkErrorObj;
      }
}

export async function getAllMessages(user_id,friend_id) {
    console.log('Making data query (get user)');
  
    var url = "https://data.crawfish92.hasura-app.io/v1/query";

    // If you have the auth token saved in offline storage, obtain it in async componentDidMount
    // var authToken = await AsyncStorage.getItem('HASURA_AUTH_TOKEN');
    // And use it in your headers
    // headers = { "Authorization" : "Bearer " + authToken }
    var requestOptions = {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": "Bearer 6367e4fc89e80a142071170876248bf65157081698930b18"
        }
    };

    //var sqlquery = "SELECT DISTINCT ON (user_id) * FROM (   SELECT 'out' AS type, msg_id, receiver_id AS user_id, msg_text, sent_time   FROM   messages  WHERE  sender_id = "+user_id+" UNION  ALL    SELECT 'in' AS type, msg_id, sender_id AS user_id, msg_text, sent_time FROM   messages WHERE  receiver_id = "+user_id+" ) sub ORDER BY user_id, sent_time DESC;"

    var body = {
        "type": "run_sql",
        "args": {
            "sql": "SELECT * FROM   messages WHERE (sender_id = "+friend_id+" AND receiver_id = "+user_id+" OR sender_id = "+user_id+" AND receiver_id = "+friend_id+");"
        }
    };

    requestOptions.body = JSON.stringify(body);

    try {
        let resp = await fetch(dataUrl, requestOptions);
        console.log(resp);
        return resp.json(); 
      }
      catch(e) {
        console.log("Request Failed: " + e);
        return networkErrorObj;
      }
}