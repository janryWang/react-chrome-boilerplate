import PubSub from 'pubsub-js'



export const dispatch = (event, payload) => {
    if (chrome.tabs) {
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {
                event,
                payload
            })
        })
    } else {
        if (chrome.runtime && chrome.runtime.sendMessage) {
            try {
                chrome.runtime.sendMessage({ event, payload })
            } catch (e) {
                e = e instanceof String ? e : e instanceof Error ? e.message : String(e)
                if(e.indexOf('Extension ID') > -1 && process.env.EXTENSION_ID){
                    chrome.runtime.sendMessage(process.env.EXTENSION_ID,{ event, payload })
                }
            }
        }
    }
}

export const subscribe = (event, handler) => {
    PubSub.subscribe(event, (msg,data)=>{
        typeof handler == 'function' && handler(data)
    })
}

if (chrome.runtime && chrome.runtime.onMessage && chrome.runtime.onMessage.addListener) {

    chrome.runtime.onMessage.addListener(
        function (action) {
            PubSub.publish(action.event, action.payload)
        });
}

export default {
    dispatch,
    subscribe
}