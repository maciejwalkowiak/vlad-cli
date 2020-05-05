const {Command, flags} = require('@oclif/command')
const inquirer = require('inquirer')
const fetch = require('node-fetch')
const opn = require('opn')


class VladCommand extends Command {
  static strict = false

  static args = [
    {name: 'search'}
  ]

  async run() {
    const {args,argv} = this.parse(VladCommand)
    const query = argv.join(' ')
    const r = await fetch(`https://vladmihalcea.com/wp-json/wp/v2/search?search=${query}`)
    const json = await r.json()

    if (json.length === 0) {
      this.log(`😕 No articles found for query "${query}"`)
      return;
    }

    let responses = await inquirer.prompt([{
      name: 'stage',
      message: '🤔 Choose article',
      type: 'rawlist',
      choices: json.map(function (entry) {
        return {name: entry.title}
      })
    }])

    const result = json.filter(entry => entry.title === responses.stage)

    if (result.length === 0 || result.length > 1) {
      this.error('😡 Ooops something went wrong');
    } else {
      const url = result[0].url
      this.log(`😁 Opening ${url}`)
      opn(url)
    }
  }
}

VladCommand.description = `Describe the command here
Not really much to say. Perhaps check out my Java & Spring YouTube channel https://youtube.com/springacademy
`

VladCommand.flags = {
  // add --version flag to show CLI version
  version: flags.version({char: 'v'}),
  // add --help flag to show CLI version
  help: flags.help({char: 'h'}),
}

module.exports = VladCommand
