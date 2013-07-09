define([
    'dojo/ready',
    'dojo/on',
    'dojo/_base/lang',
    'dojo/topic',
    'dojo/_base/declare',
    'dojo/_base/event',
    'dojo/string',
    'dojo/_base/window',
    'dijit/form/Form',
    'dojox/mobile/View',
    'dojox/mobile/ScrollableView',
    'dojox/mobile/TextBox',
    'dojox/mobile/Button',
    'dojox/layout/TableContainer',
    'moch/app/mobile',
    'moch/app/util',
    'moch/store/SqlStore',
    'dojo/text!./kso.sql',
    'dojo/store/Observable',
    'dojox/mobile/Heading',
    'kso/TabBarLogin',
    'kso/views/Home',
    'kso/views/PlanList',
    'kso/views/PlanCreate',
    'kso/views/PlanEdit',
    'kso/views/PlanEval',
    'kso/views/Plan',
    'kso/views/DiaryList',
    'kso/views/DiaryEdit',
    'kso/views/ProblemList',
    'kso/views/ProblemCreate',
    'kso/views/ProblemEdit',
    'kso/views/ProblemEval',
    'kso/views/Problem',
    'kso/views/SolutionList',
    'kso/views/SolutionCreate',
    'kso/views/SolutionEdit',
    'kso/views/About',
    'dojox/mobile/compat',
    './deviceReady!'
], function( ready, on, lang, topic, declare, event, dstr, win, Form, View, ScrollableView,
    TextBox, Button, TableContainer, App, util, Store, init_sql, Observable, Heading,
    TabBar, HomeView, PlanListView, PlanCreateView, PlanEditView, PlanEvalView,
    PlanView, DiaryEditView, DiaryListView,
    ProblemListView, ProblemCreateView, ProblemEditView, ProblemEvalView, ProblemView,
    SolutionListView, SolutionCreateView, SolutionEditView, AboutView ) {

    function body_addChild( v ) {
        win.body().appendChild( v.domNode );
        v.startup();
    }

    function do_login( login, password ) {
        if( typeof login == 'undefined' && window.localStorage ) {
            var st = window.localStorage;

            login = st.getItem( 'user_login' );
            password = st.getItem( 'user_password' );
            console.log( 'fetching login ' + login + ' from localStorage' );
        }

        if( login && password ) {
            App.rpc().user_login( {login: login, password: password} ).then( function( res ) {
                if( res.valid == true ) {
                    topic.publish( 'moch/loggedin', res.valid );

                    if( window.localStorage ) {
                        var st = window.localStorage;

                        st.setItem( 'user_login', login );
                        st.setItem( 'user_password', password );

                        console.log( 'storing ' + login + ' in localStorage' );
                    }
                } else {
                    if( res.error ) {
                        alert( dstr.substitute( res.error, {handle: login} ));
                    }
                }
            });
        }
    }

    var LoginView = declare( [View], {
        id: 'login_view',

        postCreate: function() {
            var self = this;

            sview = new ScrollableView();

            var f = new Form({
                onSubmit: function( ev ) {
                    event.stop( ev );

                    var vals = f.get( 'value' );

                    do_login( vals.login, vals.password );
                }
            });

            var tbl = new TableContainer({
                orientation: 'vert'
            });

            tbl.addChild( new TextBox({
                label: 'Log ind på Din Handleplan',
                placeHolder: 'Indtast e-mail',
                name: 'login',
                style: {width:'99%'}
            }));

            tbl.addChild( new TextBox({
                placeHolder:'Indtast kode',
                name: 'password',
                type: 'password',
                style: {width:'99%'}
            }));

            tbl.addChild( new Button({
                label: 'Log ind',
                type: 'submit',
                spanLabel: true,
                style: {width:'100%'}
            }));

            tbl.startup();
            f.domNode.appendChild( tbl.domNode );

            sview.addChild( f );

            this.addChild( sview );

            this.addChild( new TabBar() );
        }
    });

    var ForgotPasswordView = declare( [View], {
        id: 'forgot_password_view',

        postCreate: function() {
            var self = this;

            sview = new ScrollableView();

            var f = new Form({
                onSubmit: function( ev ) {
                    event.stop( ev );

                    var vals = f.get( 'value' );
                    vals.send_new_password = true;

                    App.rpc().user_login( vals ).then( function( res ) {
                        if( res.valid == true ) {
                            console.log( 'email send with new password', res );
                        } else if( res.error ) {
                            alert( dstr.substitute( res.error, {handle: vals.login} ));
                        }
                    });
                }
            });

            var tbl = new TableContainer({
                orientation: 'vert'
            });

            tbl.addChild( new TextBox({
                label: 'Få tilsendt en ny kode:',
                placeHolder:'Indtast e-mail',
                name: 'email',
                style: {width:'99%'}
            }));

            tbl.addChild( new Button({
                label: 'Send ny kode',
                type: 'submit',
                spanLabel: true,
                style: {width:'99%'}
            }));

            tbl.startup();
            f.domNode.appendChild( tbl.domNode );

            sview.addChild( f );

            this.addChild( sview );

            this.addChild( new TabBar() );
        }
    });

    var CreateUserView = declare( [View], {
        id: 'create_user_view',

        postCreate: function() {
            var self = this;

            sview = new ScrollableView();

            var f = new Form({
                onSubmit: function( ev ) {
                    event.stop( ev );

                    var vals = f.get( 'value' );
                    vals.authorization_key = 'kso_new_user';

                    App.rpc().self_registration( vals ).then( function( res ) {
                        if( res.valid == true ) {
                            console.log( 'new user created', res );
                        } else if( res.error ) {
                            alert( dstr.substitute( res.error, {handle: vals.login} ));
                        }
                    });
                }
            });

            var tbl = new TableContainer({
                orientation: 'vert',
                customClass: 'login'
            });

            tbl.addChild( new TextBox({
                label: 'Opret en ny bruger:',
                placeHolder:'Indtast e-mail',
                name: 'new_user_email',
                style: {width:'99%'}
            }));

            tbl.addChild( new TextBox({
                placeHolder:'Indtast valgfri kode',
                name: 'password',
                style: {width:'99%'}
            }));

            tbl.addChild( new Button({
                label: 'Opret bruger',
                type: 'submit',
                spanLabel: true,
                style: {width:'99%'}
            }));

            tbl.startup();
            f.domNode.appendChild( tbl.domNode );

            sview.addChild( f );

            this.addChild( sview );

            this.addChild( new TabBar() );
        }
    });

    function make_login() {
        this._login_view = new LoginView();
        body_addChild( this._login_view );
        body_addChild( new ForgotPasswordView() );
        body_addChild( new CreateUserView() );
    }

    App.init({
        auto_login: true,

        _local_stores: {},

        _local_stores_cnt: 0,

        getStore: function( name, entity_name ) {
            if( !(name in this._local_stores) ) {
                var args = {
                    db_name: 'kso',
                    trace: true,
                    entity_name: entity_name
                };

                // Only make the creation script on the first created entity
                if( this._local_stores_cnt == 0 ) {
                    args.onDatabaseCreate = function( db ) {
                        var sql = init_sql.split( ';' );
                        for( i in sql ) {
                            var stmt = sql[ i ].trim();
                            if( stmt.length > 5 )
                                db.executeSql( stmt, [], function(t,r) {}, function(t, e) {
                                    console.error( "error in SQL ", stmt );
                                });
                        }
                    };
                }

                switch( entity_name ) {
                    case 'kso_problem':
                        args.table_name = 'kso_problem';
                        args.meta = [
                            'id',
                            'do_what',
                            'do_prevent',
                            'do_solution',
                            'do_help',
                            'do_evaluate',
                            'do_evaluate_txt',
                            'active',
                            'public',
                            'hidden'];
                        break;

                    case 'kso_plan':
                        args.table_name = 'kso_plan';
                        args.meta = [
                            'id',
                            'do_what',
                            'do_how_much',
                            'do_when',
                            'do_how_often',
                            'do_in_days',
                            'do_success',
                            'do_evaluate',
                            'do_evaluate_txt',
                            'active',
                            'public',
                            'hidden',
                            'use_at_start',
                            'use_at_end'];
                        break;

                    case 'kso_diary':
                        args.table_name = 'kso_diary';
                        args.meta = [
                            'id',
                            'plan_id',
                            'info',
                            'success',
                            'use_at'];
                        break;

                    case 'kso_solution':
                        args.table_name = 'kso_solution';
                        args.meta = [
                            'id',
                            'problem_id',
                            'info',
                            'success'];
                        break;

                    default:
                        alert( "requesting unknown table_entity " + entity_name );
                }

                this._local_stores_cnt++;
                this._local_stores[ name ] = Observable( new Store(args));

                console.log( 'create new entity ', name, entity_name );
            }

            return this._local_stores[ name ];
        },

        createHome: function() {
            if( !this._main_view ) {
                this._main_view = new HomeView();
                body_addChild( this._main_view );
            }
        },

        onReady: function() {
            // set reminder on app startup
            this.onLogin(); // Fake out login

            // XXX, We may user the Observerble interface instead, to eliminate any polling
            window.setInterval(
                lang.hitch(this, function(){
                    this.onReminder();
            }), 60*60*1000);
        },

        onReminder: function() {
            var store = this.getStore( 'kso_plan', 'kso_plan');

            var res = store.query();

            res.then( function( res ) {
                var reminder_list = [];
                var now = new Date();

                for( var i=0; i<res.length; i++ ) {
                    if( res[i].active == true && res[i].hidden == false )
                        var use_at_end = util.iso_to_date( res[i].use_at_end );

                        if( now >= use_at_end )
                            reminder_list.push( res[i].do_what );
                }

                if( reminder_list.length > 0 ) {
                    App.getInstance().notification('Husk', null,
                    'Husk at afslutte og evaluerer disse handleplaner:\r\n' + reminder_list.join('\r\n'));
                }
            });
        },

        onUserLogin: function() {
            do_login();

            this._login_view = new LoginView();
            body_addChild( this._login_view );
            body_addChild( new ForgotPasswordView() );
            body_addChild( new CreateUserView() );
        },

        onLogin: function() {
            this.createHome();

            body_addChild( new PlanListView() );
            body_addChild( new PlanCreateView() );
            body_addChild( new PlanEditView() );
            body_addChild( new PlanEvalView() );
            body_addChild( new PlanView() );

            body_addChild( new DiaryListView() );
            body_addChild( new DiaryEditView() );

            body_addChild( new ProblemListView() );
            body_addChild( new ProblemCreateView() );
            body_addChild( new ProblemEditView() );
            body_addChild( new ProblemEvalView() );
            body_addChild( new ProblemView() );

            body_addChild( new SolutionListView() );
            body_addChild( new SolutionCreateView() );
            body_addChild( new SolutionEditView() );

            body_addChild( new AboutView() );

            // set reminder on app startup
            this.onReminder();

            // set reminder every 10 minutes
            window.setInterval(
                lang.hitch(this, function(){
                    this.onReminder()
            }), 10*60*1000);

            if( this._login_view ) {
                this._login_view.performTransition( 'kso_home_view', -1, 'coverv' );
            }
        }
    });
});
