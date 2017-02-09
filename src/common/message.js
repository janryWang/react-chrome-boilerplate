import PubSub from 'pubsub-js'



const dispatch = (event, payload) => {
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
        chrome.runtime.sendMessage({ event, payload })
    }
}

const subscribe = (event, handler) => {
    PubSub.subscribe(event,handler)
}

chrome.runtime.onMessage.addListener(
    function (action) {
        PubSub.publish(action.event, action.payload)
    });

export default {
    dispatch,
    subscribe
}