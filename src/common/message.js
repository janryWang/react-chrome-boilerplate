import PubSub from 'pubsub-js'

if (chrome.extension) {
    chrome.extension.onMessage.addListener(
        (request) => {
            PubSub.publish('CONTENT_DISPATCH', request)
        }
    )
}

PubSub.subscribe('CONTENT_DISPATCH', (msg, action) => {

})


PubSub.subscribe('BACKGROUND_DISPATCH', (msg, action) => {
    if (chrome) {
        if (chrome.tabs) {//background
            chrome.tabs.query({
                active: true,
                currentWindow: true
            }, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, action)
            })
        } else if (chrome.extension) {//content
            chrome.extension.sendMessage(action)
        }
    }
})


const getEnv = () => {
    if (chrome.tabs) {
        return 'background'
    } else {
        return 'content'
    }
}


const dispatch = (event, payload) => {
    const env = getEnv()
    if (env == 'background') {
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