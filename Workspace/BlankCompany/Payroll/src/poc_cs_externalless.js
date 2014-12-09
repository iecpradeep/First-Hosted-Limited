Ext.require([
    'Ext.window.MessageBox',
    'Ext.tip.*',
    'Ext.container.Viewport'
]);

Ext.application({
    name: 'HelloExt',
    launch: function() {
        Ext.MessageBox.alert('Status', 'Changes saved successfully.', showResult);
        Ext.create('Ext.container.Viewport', {
            layout: 'fit',
            items: [
                {
                    title: 'Hello Ext',
                    html : 'Hello! Welcome to Ext JS.'
                }
            ]
        });
    }
});

