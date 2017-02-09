const fs = require('fs-extra')
const Path = require('path')
const glob = require('glob')
const ejs = require('ejs')
const execa = require('execa')
const webStore = require('./webstore')


const src = (path) => {
    return Path.resolve(__dirname, '../src', path)
}

const generateAlias = (path) => {
    path = Path.resolve(process.cwd(),path)
    const files = fs.readdirSync(path)
    return files.reduce((buf, filename) => {
        const file_path = Path.join(path, filename)
        const stats = fs.lstatSync(file_path)
        if (stats && stats.isDirectory()) {
            buf[filename] = Path.resolve('../',file_path)
        }
        return buf
    }, {})
}

const templateExt = /^(?:\.css|\.less|\.jsx?|\.json|\.ejs|\.html?|\.xml)$/

const compileTpls = (pattern, dist, data) => {
    glob(pattern, {}, (err, files) => {
        if (!err) {
            files.forEach((file_path) => {
                const dist_path = file_path.replace(/^(\/?)([^\/]+)\//, '$1' + dist + '\/')
                const is_template = templateExt.test(Path.extname(file_path))
                const file = fs.readFile(file_path, { encoding: is_template ? 'utf8' : null }, (err, contents) => {
                    if (!err) {
                        fs.outputFile(dist_path, is_template ? ejs.render(contents, data) : contents)
                    } else {
                        console.error(err)
                    }
                })

            })
        } else {
            console.error(err)
        }
    })
}


const package = (name) => {
    name = name || 'crx'
    fs.stat('./' + name + '.pem', (err, stat) => {
        const cmd = '/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --pack-extension=./' + name

        if (!err || stat && stat.isFile()) {
            cmd += '  --pack-extension-key=./' + name + '.pem'
            execa.shell(cmd).then(()=>execa.shell('zip -r -X crx.zip crx'),()=>execa.shell('zip -r -X crx.zip crx'))
        } else {
            execa.shell(cmd).then(() => {
                package()
            },()=>{
                package()
            })
        }

    })
}

const startServer = (port)=>{
    port = port || '6006'
    execa.shell('start-storybook -p '+port)
    setTimeout(()=>{
        execa.shell('open http://localhost:'+port)
    },1000)
}

const publish = (name,options)=>{
    const instance = webStore(options)
    const zipFilePath = './' + name + '.zip'
    instance.fetchToken().then((token)=>{
        fs.stat(zipFilePath, (err, stat) => {
            if(!err && stat.isFile()){
                const zipFile = fs.createReadStream(zipFilePath)
                instance.uploadExisting(zipFile,token)
                .then(()=>instance.publish('default',token))
                .catch(e=>console.error(e))
            } else {
                console.error(err)
            }
        })
    })
}

module.exports = {
    src,
    generateAlias,
    compileTpls,
    package,
    startServer,
    publish
}