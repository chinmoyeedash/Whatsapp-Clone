

const dataUrl = 'https://data.crawfish92.hasura-app.io/v1/query';
const loginUrl = 'https://auth.crawfish92.hasura-app.io/v1/login';
const signupUrl = 'https://auth.crawfish92.hasura-app.io/v1/signup';

import { Alert, AsyncStorage } from 'react-native';
const IMEI = require('react-native-imei');
import fetch from 'isomorphic-fetch'
// // Fixes isomorphic-fetch
// GLOBAL.self = GLOBAL;
const networkErrorObj = {
  status: 503
}

const defaultimg = '61316c53-6640-4d9a-a586-3a9c1892716d';
const bearerToken = "Bearer 6e3bfbf5f7b27daa2812541585886b06215c48c30883031e";

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
    console.log(IMEI, IMEI.getImei());
    requestOptions.body = JSON.stringify(body);
    try {
      await fetch(signupUrl, requestOptions)
      .then(function(response) {
          console.log(response);
          if (response.status !== 200) {
            if (response.status === 504) {
              Alert.alert('Network Error', 'Check your internet connection');
            } else {
              Alert.alert('Error', `Signup Unsuccessful, Pl.Try Again!  ${response.status}`);      
            }
            throw new Error(response.statusText);
          } 
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
                          "user_id": result.hasura_id
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
            if (response.status !== 200) {
                if (response.status === 504) {
                  Alert.alert('Network Error', 'Check your internet connection');
                } else {
                  Alert.alert('Error', `Signup Unsuccessful, Pl.Try Again!  ${response.status}`);      
                }
                throw new Error(response.statusText);
            }
            return response; 
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
        "Content-Type": "application/json",
        "Authorization": bearerToken
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
    var userToken  = "Bearer " + authToken
    var requestOptions = {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
            //for defective95 "Authorization": "Bearer bd69be047e89fb3ac98e788222ee2a56547be1b35ef14fd3"
            "Authorization": userToken
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

export async function uploadPicture(dp,user_id) {
    // var fetchAction =  require('fetch');
     var fileurl = "https://filestore.crawfish92.hasura-app.io/v1/file/" + user_id;
     //const dp1 = "file:///storage/emulated/0/Android/data/com.chatsapp/files/Pictures/image-efe99812-2f01-4b78-9f96-46ffd02186a1.jpg";
    // console.log('dp', dp1);
     console.log('dp', dp);
    //  // If you have the auth token saved in offline storage, obtain it in async componentDidMount
      var authToken = await AsyncStorage.getItem('HASURA_AUTH_TOKEN');
    // // And use it in your headers
     var userToken  = "Bearer " + authToken
    var requestOptions = {
        method: 'PUT',
        headers: {
        "Content-Type": "image/png",
        "Authorization": userToken
        },
        body: dp
    }

    try {
        let resp = await fetch(fileurl, requestOptions);
        console.log(resp);
        return resp.json(); 
      }
      catch(e) {
        console.log("Request Failed: " + e);
        return networkErrorObj;
      }
    
}

// export async function updateRecdTime(user_id, friend_id) {
//      // If you have the auth token saved in offline storage, obtain it in async componentDidMount
//      var authToken = await AsyncStorage.getItem('HASURA_AUTH_TOKEN');
//      // And use it in your headers
//      var userToken  = "Bearer " + authToken 
//     var requestOptions = {
//         "method": "POST",
//         "headers": {
//             "Content-Type": "application/json",
//             "Authorization": bearerToken
//         }
//     };
 
//     var now = new Date();
    
//     var body = {
//         "type": "run_sql",
//         "args": {
//             "sql": "UPDATE messages SET recd_time = '" + now + "' WHERE ((sender_id = " + friend_id + " AND receiver_id = " + user_id + ") AND recd_time = 'NULL') ;"
//         }
//     };
    
//     requestOptions.body = JSON.stringify(body);
    
//     fetch(dataUrl, requestOptions)
//     .then(function(response) {
//         return response.json();
//     })
//     .then(function(result) {
//         console.log(result);
//     })
//     .catch(function(error) {
//         console.log('Request Failed:' + error);
//     });
// }

export async function getContacts(user_id) {
	console.log('Making data query (get contacts)');
    // If you have the auth token saved in offline storage, obtain it in async componentDidMount
    var authToken = await AsyncStorage.getItem('HASURA_AUTH_TOKEN');
    // And use it in your headers
    var userToken  = "Bearer " + authToken 
    var requestOptions = {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": userToken
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
    console.log(requestOptions);

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
   var userToken = "Bearer " + authToken 
  var requestOptions = {
      "method": "POST",
      "headers": {
        "Content-Type": "application/json",
        //  "Authorization": "Bearer bd69be047e89fb3ac98e788222ee2a56547be1b35ef14fd3"
        "Authorization": userToken
   
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
   var userToken = "Bearer " + authToken
    var requestOptions = {
        "method": "POST",
        "headers": {
          "Content-Type": "application/json",
          "Authorization": userToken
     
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
  
// export async function getUnreadMessages() {
//     console.log('Making data query (get unread messages)');
//      // If you have the auth token saved in offline storage, obtain it in async componentDidMount
//      //var authToken = await AsyncStorage.getItem('HASURA_AUTH_TOKEN');
//     // And use it in your headers
//     //userToken = "Bearer " + authToken
//     var requestOptions = {
//         "method": "POST",
//         "headers": {
//             "Content-Type": "application/json",
//             "Authorization": "Bearer 6e3bfbf5f7b27daa2812541585886b06215c48c30883031e"
//         }
//     };
    
//     var body = {
//         "type": "run_sql",
//         "args": {
//             "sql": "SELECT sender_id, count(recd_time) as unread FROM messages where recd_time = 'NULL' GROUP BY sender_id,recd_time "
//         }
//     };
    
//     requestOptions.body = JSON.stringify(body);
    
//     try {
//         let resp = await fetch(dataUrl, requestOptions);
//         console.log(resp);
//         return resp.json(); 
//       }
//       catch(e) {
//         console.log("Request Failed: " + e);
//         return networkErrorObj;
//       }
// }

// export async function getLastMessages(user_id) {
//     console.log('Making data query (get last messages)');
  
//      // If you have the auth token saved in offline storage, obtain it in async componentDidMount
//      //var authToken = await AsyncStorage.getItem('HASURA_AUTH_TOKEN');
//     // And use it in your headers
//     //var userToken = "Bearer " + authToken
//     console.log(bearerToken);
//     var requestOptions = {
//         "method": "POST",
//         "headers": {
//             "Content-Type": "application/json",
//             "Authorization": "Bearer 6e3bfbf5f7b27daa2812541585886b06215c48c30883031e",
//             "X-Hasura-Role": "admin"
//         }
//     };
    

//     const sqlquery = "SELECT DISTINCT ON (friend_id) * FROM (   SELECT 'out' AS type, msg_id, receiver_id AS friend_id, msg_text, sent_time, recd_time  FROM   messages  WHERE  sender_id = "+user_id+" UNION  ALL    SELECT 'in' AS type, msg_id, sender_id AS friend_id, msg_text, sent_time,recd_time FROM   messages WHERE  receiver_id = "+user_id+" ) sub ORDER BY friend_id, msg_id DESC;"
//     //"SELECT DISTINCT ON (friend_id) * FROM (SELECT 'out' AS type, msg_id, receiver_id AS friend_id, msg_text, sent_time, recd_time FROM messages WHERE sender_id = 1 UNION ALL SELECT 'in' AS type, msg_id, sender_id AS friend_id, msg_text, sent_time, recd_time FROM messages WHERE  receiver_id = 1) sub ORDER BY friend_id, sent_time DESC;"
//     var body = {
//         "type": "run_sql",
//         "args": {
//             "sql": sqlquery
//         }
//     };
    
//     requestOptions.body = JSON.stringify(body);
//     console.log(requestOptions);
//     try {
//         let resp = await fetch(dataUrl, requestOptions);
//         console.log(resp);
//         return resp.json(); 
//       }
//       catch(e) {
//         console.log("Request Failed: " + e);
//         return networkErrorObj;
//       }
// }

export async function updateRecdTime(user_id, friend_id) {
    var msgurl = "https://app.crawfish92.hasura-app.io/updateRecdTime?user_id='"+ user_id + "'&friend_id='" + friend_id + "'";
    try {
        let lastmsgresponse = await fetch(msgurl);
        console.log('lastmsgresponse', lastmsgresponse);
       return lastmsgresponse.json();
    }
    catch(e) {
        console.log("Request Failed: " + e);
        return networkErrorObj;
    }
}

export async function getLastMessages(user_id) {
    var msgurl = "https://app.crawfish92.hasura-app.io/getLastMessages?user_id="+ user_id;
    try {
        let lastmsgresponse = await fetch(msgurl);
        console.log('lastmsgresponse', lastmsgresponse);
       return lastmsgresponse.json();
    }
    catch(e) {
        console.log("Request Failed: " + e);
        return networkErrorObj;
    }
}

export async function getUnreadMessages() {
    var unreadmsgurl = "https://app.crawfish92.hasura-app.io/getUnreadMessages";
    let response = await fetch(unreadmsgurl);
    try {
        let response = await fetch(unreadmsgurl);
        console.log(response);
       return response.json();
    }
    catch(e) {
        console.log("Request Failed: " + e);
        return networkErrorObj;
    }
}

export async function getAllMessages(user_id, friend_id) {
    var msgurl = "https://app.crawfish92.hasura-app.io/getallMessages?user_id='"+ user_id + "'&friend_id='" + friend_id + "'";
    try {
        let allmsgresponse = await fetch(msgurl);
        console.log('allmsgresponse', allmsgresponse);
       return allmsgresponse.json();
    }
    catch(e) {
        console.log("Request Failed: " + e);
        return networkErrorObj;
    }
}

// export async function getAllMessages(user_id,friend_id) {
//     console.log('Making data query (get all messages)');
  
//      // If you have the auth token saved in offline storage, obtain it in async componentDidMount
//      var authToken = await AsyncStorage.getItem('HASURA_AUTH_TOKEN');
//     // And use it in your headers
//     var userToken = "Bearer " + authToken
//     var requestOptions = {
//         "method": "POST",
//         "headers": {
//             "Content-Type": "application/json",
//             "Authorization": userToken    
//         }
//     };

//     //var sqlquery = "SELECT DISTINCT ON (user_id) * FROM (   SELECT 'out' AS type, msg_id, receiver_id AS user_id, msg_text, sent_time   FROM   messages  WHERE  sender_id = "+user_id+" UNION  ALL    SELECT 'in' AS type, msg_id, sender_id AS user_id, msg_text, sent_time FROM   messages WHERE  receiver_id = "+user_id+" ) sub ORDER BY user_id, sent_time DESC;"

//     var body = {
//         "type": "run_sql",
//         "args": {
//             "sql": "SELECT * FROM   messages WHERE (sender_id = "+friend_id+" AND receiver_id = "+user_id+" OR sender_id = "+user_id+" AND receiver_id = "+friend_id+");"
//         }
//     };

//     requestOptions.body = JSON.stringify(body);

//     try {
//         let resp = await fetch(dataUrl, requestOptions);
//         console.log(resp);
//         return resp.json(); 
//       }
//       catch(e) {
//         console.log("Request Failed: " + e);
//         return networkErrorObj;
//       }
// }