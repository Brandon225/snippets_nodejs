![alt text](https://github.com/Brandon225/snippet_converter/blob/master/img/logo.png "reimagin8d")

# Snippets - A text editor snippet converter<a name="snippets"></a>

This app allows developers to easily migrate their snippets when moving to a new text editor.

----------

### Table of Contents

- [Snippets - A text editor snippet converter](#snippets)
	- [Running on your computer](#running)
	- [CRUD functionality](#crud)
		- [Create](#create)
		- [Read](#read)
		- [Update](#update)
		- [Delete](#delete)
	- [Formatting](#formatting)
		- [Atom](#atom)
		- [Brackets](#brackets)
		- [Sublime Text](#sublime-text)
		- [Visual Studio Code](#vis-code)


## Running on your computer<a name="running"></a>
*Run the following scripts in terminal.*

>**cd into the project's root directory**
```
cd <root directory>
```
>**Install packages**
```
npm install
```
>**Start Mongo**
```
mongod
```

>**Start server**
```
nodemon
```

## CRUD<a name="crud"></a>

### Create<a name="create"></a>
* Register an account (http://localhost:3000/register). A user document is created.
* On the homepage (http://localhost:3000) create a snippet. A snippet document is created.

### Read<a name="read"></a>
* View snippets in the public library (http://localhost:3000/library/atom). Snippets documents are read.
* View snippets you have created in your profile (http://localhost:3000/profile/visual_studio_code/source/js). Snippets documents associated with your account are read.

### Update<a name="update"></a>
*  Update your account by adding snippets from the public library (http://localhost:3000/library/atom).  Selected snippets are duplicated and the user document's snippets list is updated with the new snippets id.  The user documents scope list is also updated with the snippets scope.


### Delete<a name="delete"></a>
* Any snippet you have created can be deleted in the public library or your profile page (http://localhost:3000/library/atom) (http://localhost:3000/profile/visual_studio_code/source/js). The user's account is updated by removing the snippet from their snippet list.  The snippet is also removed from the snippets document.
* Any snippet you have duplicated or created can be deleted from your profile page  (http://localhost:3000/profile/visual_studio_code/source/js). The user's account is updated by removing the snippet from their snippet list.  The snippet is also removed from the snippets document.

## Formatting<a name="formatting"></a>

### Atom
*Atom snippets should be formatted using CoffeeScript.*

There is a text file in your ~/.atom directory called snippets.cson that contains all your custom snippets that are loaded when you launch Atom. You can also easily open up that file by selecting the Atom > Snippets menu.

>**Example**
>
```
'.source.js':
	'console.log':
		'prefix': 'log'
		'body': 'console.log($1);$2'
```

[more info](http://flight-manual.atom.io/using-atom/sections/snippets/)

### Brackets<a name="brackets"></a>
*This is formatting information for the Brackets https://github.com/jrowny/brackets-snippets Snippets extension.*

In Brackets each .json file corresponds to a set of snippets. You can use whatever names you would like, but it makes sense to follow Jonathan’s lead and name your files based on the category of snippet used. If you open up one of the files you can see it is a JSON-structured array of objects.

> **Example**
```
[
{
    "name":"Log to the Console",
        "trigger":"log",
        "usage":"source.js",
        "description":"Log to the Console",
        "template":"\nconsole.log($1:  $2);\n"

}
]
```

[more info](http://blog.brackets.io/2012/12/19/snippets-brackets-extension/?lang=en)

### Sublime Text<a name="sublime-text"></a>
To create a new snippet, select Tools | New Snippet…. Sublime Text will present you with an skeleton for a new snippet.

Snippets can be stored under any package’s folder, but to keep it simple while you’re learning, you can save them to your Packages/User folder.

>**Example**

```
<snippet>
	<content><![CDATA[console.log('$1: ', $2)]]></content>
	<tabTrigger>log</tabTrigger>
	<scope>source.js</scope>
	<description>Log to the Console</description>
</snippet>
```
[more info](http://docs.sublimetext.info/en/latest/extensibility/snippets.html?highlight=Snippets)

### Visual Studio Code<a name="vis-code"></a>
*Snippets are defined in a JSON format and stored in a per user (languageId).json file. For example, Markdown snippets go in a markdown.json file.*

You can define your own snippets for specific languages. To open up a snippet file for editing, open User Snippets under File > Preferences (Code > Preferences on Mac) and select the language for which the snippets should appear.

>**Example**

```
{
	"Console Log": {
		"prefix": "log",
		"body": [
			"console.log('$1: ', $2)"
		],
		"description": "Log to console"
	}
}
```

[more info](https://code.visualstudio.com/docs/editor/userdefinedsnippets)


