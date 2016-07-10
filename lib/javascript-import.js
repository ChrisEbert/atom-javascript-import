'use babel';

import { CompositeDisposable, File } from 'atom';
import espree from 'espree';

export default {
  subscriptions: null,

  activate(state) {
    console.log('yeah');

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-text-editor', {
      'javascript-import:bindClick': () => this.bindClick()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  bindClick() {

    const editor = atom.workspace.getActivePaneItem().editorElement;

    const clickEvent = () => {
      const edi = atom.workspace.getActiveTextEditor();
      const row = edi.getCursorScreenPosition();
      const text = edi.lineTextForScreenRow(row.row);
      const path = edi.getPath();

      const file = new File(path);
      const folder = file.getParent().path;

      try {
        const imp = espree.parse(text, {
          ecmaVersion: 6,
          sourceType: 'module'
        });

        const str = imp.body[0];

        if (str.type === 'ImportDeclaration') {
          atom.workspace.open(`${folder}/${str.source.value}.js`);
        }
      } catch (e) {}

      editor.removeEventListener('click', clickEvent);
    };

    editor.addEventListener('click', clickEvent);

  }

};
