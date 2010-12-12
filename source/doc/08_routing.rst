==================
8日目 ルーティング
==================

:Author: Shogo Kawahara <Twitter: @ooharabucyou>
:Date: 2010-12-08

今日は、URLを正しく定義するためにルーティングを学びましょう。

.. note:: 関連する symfony のドキュメント

  * `A Gentle Introduction to symfony | 第9章 リンクとルーティングシステム <http://www.symfony-project.org/gentle-introduction/1_4/ja/09-Links-and-the-Routing-System>`_

ルーティングとは
================

symfony のドキュメントによると以下のようになっています。

  ルーティング (routing) とは URL をユーザーフレンドリーに書き換えるメカニズムです。 [#r1]_

URLを意味を持ったものにするという利点だけでなく、以下のような利点があります。

* リファクタリング時にアクションや内部構造を変えても、同じURLでアクセスできるようにすることが可能。
* デフォルトの ``module/action`` というURLを利用するよりパフォーマンスが向上します。

  - ``module/action`` という形式はデフォルトのルーティングですが OpenPNE3 では推奨されていません。詳しくは以下の Note を見てください。

.. note:: デフォルトルーティングの非推奨

  OpenPNE3では、ルーティングを定義しないことは非推奨とされています。

  開発環境の場合はルーティングを定義しないまま利用すると、ログにエラーが残ります。


.. [#r1] `A Gentle Introduction to symfony | 第9章 - リンクとルーティングシステム <http://www.symfony-project.org/gentle-introduction/1_4/ja/09-Links-and-the-Routing-System>`_

ルーティングの定義
==================

プラグインでのルーティングの定義は、アプリケーションごとに行うことができます。

例を示すために、opSamplePlugin に新たなモジュールを追加します。 ``miniDiary`` という名前にします。

::

  $ cd $openpne_dir
  $ php symfony opGenerate:module opSamplePlugin pc_frontend miniDiary


アクションを幾つか作成します。

``$your_plugin_dir/apps/pc_frontend/modules/miniDiary/actions/actions.class.php``

.. code-block:: php

  <?php

  class miniDiaryActions extends sfActions
  {
    // miniDiary一覧の表示
    public function executeList(sfWebRequest $request)
    {
    }

    // miniDiaryの作成画面
    public function executeNew(sfWebRequest $request)
    {
    }

    // miniDiaryの作成
    public function executeCreate(sfWebRequest $request)
    {
    }

    // miniDiaryの編集画面
    public function executeEdit(sfWebRequest $request)
    {
    }

    // miniDiaryの更新
    public function executeUpdate(sfWebRequest $request)
    {
    }

    // miniDiaryの表示
    public function executeShow(sfWebRequest $request)
    {
    }

    // miniDiaryの削除確認
    public function executeDeleteConfirm(sfWebRequest $request)
    {
    }

    // miniDiaryの削除
    public function executeDelete(sfWebRequest $request)
    {
    }
  }

また、 ``$your_plugin_dir/apps/pc_frontend/modules/miniDiary/templates/`` には空の
``listSuccess.php``, ``newSuccess.php``, ``editSuccess.php``, ``showSuccess.php``, ``deleteConfirmSuccess.php`` を作成しておきましょう。

.. note::  ``$your_plugin_dir/apps/pc_frontend/modules/miniDiary/templates/indexSuccess.php`` は使わないので削除してかまいません。

ログインが必要なモジュールに変えます。

``$your_plugin_dir/apps/pc_frontend/modules/miniDiary/config/security.yml``

::

  all:
    is_secure: on
    credentials: SNSMember

プラグインの pc_frontend に対して、ルーティングを定義します。

``$your_plugin_dir/apps/pc_frontend/config/`` を作成し、以下の設定ファイルを追加します。

``$your_plugin_dir/apps/pc_frontend/config/routing.yml``

::

  mini_diaries:            # ルーティング名 (一意)
    url: /miniDiaries      # URL (一意)
    class: sfRequestRoute  # メソッドを指定するときは sfRequestRoute を使います。
    # パラメータで、module, actionを指定
    param: { module: miniDiary, action: list }
    # メソッドを指定します。
    requirements: { sf_method: [get] }

  mini_diary_new:
    url: /miniDiary/new
    class: sfRequestRoute
    param: { module: miniDiary, action: new }
    requirements: { sf_method: [get] }

  mini_diary_create:
    url: /miniDiary
    class: sfRequestRoute
    param: { module: miniDiary, action: create }
    requirements: { sf_method: [post] }

  mini_diary_edit:
    url: /miniDiary/:id/edit
    # IDが mini_diary に存在するかを確認したいので sfDoctrineRoute
    # を使う。こうすることで、アクションがシンプルになります。
    class: sfDoctrineRoute
    param: { module: miniDiary, action: edit }
    requirements:
      id: \d+              # id が数値か確認
      sf_method: [get]
    options: { model: MiniDiary, type: object } # MiniDiary の IDと照合

  mini_diary_update:
    url: /miniDiary/:id/update
    class: sfDoctrineRoute
    param: { module: miniDiary, action: update }
    requirements:
      id: \d+
      sf_method: [post]
    options: { model: MiniDiary, type: object }

  mini_diary_show:
    url: /miniDiary/:id
    class: sfDoctrineRoute
    param: { module: miniDiary, action: show }
    requirements:
      id: \d+
      sf_method: [get]
    options: { model: MiniDiary, type: object }

  mini_diary_delete_confirm:
    url: /miniDiary/:id/delete
    class: sfDoctrineRoute
    param: { module: miniDiary, action: deleteConfirm }
    requirements:
      id: \d+
      sf_method: [get]
    options: { model: MiniDiary, type: object }

  mini_diary_delete:
    url: /miniDiary/:id/delete
    class: sfDoctrineRoute
    param: { module: miniDiary, action: delete }
    requirements:
      id: \d+
      sf_method: [post]
    options: { model: MiniDiary, type: object }

  mini_diary_deny:
    url: /miniDiary/*
    param: { module: default, action: error }


ルーティングの定義は完了です。キャッシュをクリアして、 ``app:route`` で正しくルーティングが定義されているかを確認しましょう。

::

  $ cd $openpne_dir
  $ php symfony cc
  $ php symfony app:route pc_frontend

  ...

  mini_diaries                                           GET          /miniDiaries
  mini_diary_new                                         GET          /miniDiary/new
  mini_diary_create                                      POST         /miniDiary
  mini_diary_edit                                        GET          /miniDiary/:id/edit
  mini_diary_update                                      POST         /miniDiary/:id/update
  mini_diary_show                                        GET          /miniDiary/:id
  mini_diary_delete_confirm                              GET          /miniDiary/:id/delete
  mini_diary_delete                                      POST         /miniDiary/:id/delete
  mini_diary_deny                                        ANY          /miniDiary/*


``http://sns.example.com/miniDiaries`` にアクセスが可能だということもわかるでしょう。


リンクヘルパー
==============

テンプレート上でリンクを行うときは ``link_to()`` を利用します。

link_to() では、ルーティング名を利用することができます。

.. code-block:: php-inline

  <?php echo link_to('リンクテキスト', '@ルーティング名') ?>

具体的には以下のようになります。

.. code-block:: php-inline

  <?php echo link_to('ミニ日記一覧', '@mini_diaries') ?>

IDの指定が必要な時は、以下のように書けます。

.. code-block:: php-inline

  <?php echo link_to('ミニ日記一覧', '@mini_diary_show?id=1') ?>

また明日
========

次回は、フォームについて学びます。
