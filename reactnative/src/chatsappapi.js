

const dataUrl = 'https://data.crawfish92.hasura-app.io/v1/query';
const loginUrl = 'https://auth.crawfish92.hasura-app.io/v1/login';
const signupUrl = 'https://auth.crawfish92.hasura-app.io/v1/signup';

import { Alert, AsyncStorage } from 'react-native';
const IMEI = require('react-native-imei');
// import fetch from 'isomorphic-fetch'
// // Fixes isomorphic-fetch
// GLOBAL.self = GLOBAL;
const networkErrorObj = {
  status: 503
}

const defaultimg = 'https://filestore.crawfish92.hasura-app.io/v1/file/61316c53-6640-4d9a-a586-3a9c1892716d';


export async function trySignupAndInsert(phone,otp) {

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
          var now = new Date();
        
          var insertBody = {
              "type": "insert",
              "args": {
                  "table": "users",
                  "objects": [
                      {
                          "mobilenumber": phone,
                          "displayname": '',
                          "displaypic": defaultimg,
                          "status": '',
                          "lastseen": now,
                          "deviceimei": IMEI.getImei(),
                          "user_id": ressult.hasura_id
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
     var authToken = await AsyncStorage.getItem('HASURA_AUTH_TOKEN');
    // And use it in your headers
    bearerToken = "Bearer " + authToken
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

export async function uploadPicture(dp) {
    var fileurl = "https://filestore.crawfish92.hasura-app.io/v1/file";
     // If you have the auth token saved in offline storage, obtain it in async componentDidMount
     var authToken = await AsyncStorage.getItem('HASURA_AUTH_TOKEN');
    // And use it in your headers
    bearerToken = "Bearer " + authToken
    var requestOptions = {
        method: 'POST',
        headers: {
        "Authorization": bearerToken
        },
        body: dp
    }

    fetchAction(fileurl, requestOptions)
    .then(function(response) {
        return response.json();
    })
    .then(function(result) {
        console.log(result);
    })
    .catch(function(error) {
        console.log('Request Failed:' + error);
    });
}

export async function updateRecdTime(user_id, friend_id) {
     // If you have the auth token saved in offline storage, obtain it in async componentDidMount
     var authToken = await AsyncStorage.getItem('HASURA_AUTH_TOKEN');
     // And use it in your headers
     bearerToken = "Bearer " + authToken 
    var requestOptions = {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": bearerToken
        }
    };
 
    var now = new Date();
    
    var body = {
        "type": "run_sql",
        "args": {
            "sql": "UPDATE messages SET recd_time = '" + now + "' WHERE ((sender_id = " + friend_id + " AND receiver_id = " + user_id + ") AND recd_time = 'NULL') ;"
        }
    };
    
    requestOptions.body = JSON.stringify(body);
    
    fetch(dataUrl, requestOptions)
    .then(function(response) {
        return response.json();
    })
    .then(function(result) {
        console.log(result);
    })
    .catch(function(error) {
        console.log('Request Failed:' + error);
    });
}

export async function getContacts(user_id) {
	console.log('Making data query (get contacts)');
    // If you have the auth token saved in offline storage, obtain it in async componentDidMount
    var authToken = await AsyncStorage.getItem('HASURA_AUTH_TOKEN');
    // And use it in your headers
    bearerToken = "Bearer " + authToken 
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
   // If you have the auth token saved in offline storage, obtain it in async componentDidMount
   var authToken = await AsyncStorage.getItem('HASURA_AUTH_TOKEN');
   // And use it in your headers
   bearerToken = "Bearer " + authToken 
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
   // If you have the auth token saved in offline storage, obtain it in async componentDidMount
   var authToken = await AsyncStorage.getItem('HASURA_AUTH_TOKEN');
   // And use it in your headers
   bearerToken = "Bearer " + authToken
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
  
export async function getUnreadMessages() {
     // If you have the auth token saved in offline storage, obtain it in async componentDidMount
     var authToken = await AsyncStorage.getItem('HASURA_AUTH_TOKEN');
    // And use it in your headers
    bearerToken = "Bearer " + authToken
    var requestOptions = {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": bearerToken
        }
    };
    
    var body = {
        "type": "run_sql",
        "args": {
            "sql": "SELECT sender_id, count(recd_time) as unread FROM messages where recd_time = 'NULL' GROUP BY sender_id,recd_time "
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

export async function getLastMessages(user_id) {
    console.log('Making data query (get last messages)');
  
     // If you have the auth token saved in offline storage, obtain it in async componentDidMount
     var authToken = await AsyncStorage.getItem('HASURA_AUTH_TOKEN');
    // And use it in your headers
    bearerToken = "Bearer " + authToken
    var requestOptions = {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": bearerToken
        }
    };

    const sqlquery = "SELECT DISTINCT ON (friend_id) * FROM (   SELECT 'out' AS type, msg_id, receiver_id AS friend_id, msg_text, sent_time, recd_time  FROM   messages  WHERE  sender_id = "+user_id+" UNION  ALL    SELECT 'in' AS type, msg_id, sender_id AS friend_id, msg_text, sent_time,recd_time FROM   messages WHERE  receiver_id = "+user_id+" ) sub ORDER BY friend_id, msg_id DESC;"
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
  
     // If you have the auth token saved in offline storage, obtain it in async componentDidMount
     var authToken = await AsyncStorage.getItem('HASURA_AUTH_TOKEN');
    // And use it in your headers
    bearerToken = "Bearer " + authToken
    var requestOptions = {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": bearerToken
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