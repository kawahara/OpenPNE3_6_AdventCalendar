=============
15日目 テスト
=============

:Author: Shogo Kawahara <Twitter: @ooharabucyou>
:Date: 2010-12-15

SNSでは、適切なアクセスコントロールが行われているかなどをチェックする必要があります。
修正ごとに様々な条件のテストを行うことはとても大変なことです。

そこで、 symfony の自動テストを活用しましょう。

.. note:: 関連する symfony のドキュメント

  * `A Gentle Introduction to symfony | 第15章 ユニットテストと機能テスト <http://www.symfony-project.org/gentle-introduction/1_4/ja/15-Unit-and-Functional-Testing>`_

準備
====

データベースの設定を行う
------------------------

テスト用のデータベース設定を行います。

``$openpne_dir/config/database.yml``

::

  # 以下を追加

  test:
    doctrine:
      class: sfDoctrineDatabase
      param:
        dsn: '#DNS#'
        username: root
        encoding: utf8
        attributes: { 164: true }

DNSは、 ``mysql:dbname=op3_test;host=localhost`` のように設定します。

データを用意する
----------------

テスト用のデータを幾つか用意します。

テスト用のデータは、 ``$your_plugin_dir/test/fixtures/`` に YAML 形式で作成します。

``$your_plugin_dir/test/fixtures/test_data.yml``

::

  Member:
    member_1:
      name: "A"
      is_active: 1
    member_2:
      name: "B"
      is_active: 1
    member_3:
      name: "C"
      is_active: 1
    member_4:
      name: "D"
      is_active: 1
    member_xss:
      name: "<&\"'>Member.name ESCAPING HTML TEST DATA"
      is_active: 1

  MemberConfig:
    member_address_1:
      name: "pc_address"
      value: "sns@example.com"
      Member: member_1
    member_mobile_address_1:
      name: "mobile_address"
      value: "sns@example.com"
      Member: member_1
    member_password_1:
      name: "password"
      value: "<?php echo md5('password') ?>"
      Member: member_1

  # フレンド・アクセスブロック
  MemberRelationship:
    member_1_member_2:
      Member: member_1
      MemberRelatedByMemberIdFrom: member_2
      is_friend: 1
    member_2_member_1:
      Member: member_2
      MemberRelatedByMemberIdFrom: member_1
      is_friend: 1
    member_1_member_4:
      Member: member_1
      MemberRelatedByMemberIdFrom: member_4
      is_access_block: 1

  MiniDiary:
    mini_diary1:
      Member: member_1
      body: "Hello"
      public_flag: 0
    mini_diary2:
      Member: member_2
      body: "Hello"
      public_flag: 0
    mini_diary3:
      Member: member_2
      body: "Hello"
      public_flag: 1
    mini_diary4:
      Member: member_3
      body: "Hello"
      public_flag: 0
    mini_diary5:
      Member: member_3
      body: "Hello"
      public_flag: 1
    mini_diary6:
      Member: member_4
      body: "Hello"
      public_flag: 0
    mini_diary_xss:
      Member: member_xss
      body: "<&\"'>MiniDiary.body ESCAPING HTML TEST DATA"
      public_flag: 0

Unit Test
=========

:doc:`07_database2` で作成した、 MiniDiaryTable::getDiaryOrderByDateDesc() に対するテストを行いましょう。

``$your_plugin_dir/test/unit/model/MiniDiaryTableTest.php``

.. code-block:: php

  <?php

  include(dirname(__FILE__).'/../../bootstrap/unit.php');
  include(dirname(__FILE__).'/../../bootstrap/database.php');

  $t = new lime_test(4, new lime_output_color());

  $table = Doctrine::getTable('MiniDiary');

  $miniDiaries = $table->getDiaryOrderByDateDesc();

  $t->isa_ok($miniDiaries, 'Doctrine_Collection', 'MiniDiaryTable::getDiaryOrderByDateDesc() は Doctrine_Collection を返す');
  $t->is(count($miniDiaries), 5, 'MiniDiaryTable::getDiaryOrderByDateDesc() は 5件のデータを返す');

  $miniDiaries = $table->getDiaryOrderByDateDesc(1);

  $t->isa_ok($miniDiaries, 'Doctrine_Collection', 'MiniDiaryTable::getDiaryOrderByDateDesc() は Doctrine_Collection を返す');
  $t->is(count($miniDiaries), 1, 'MiniDiaryTable::getDiaryOrderByDateDesc() は 1件のデータを返す');

テストを実行するときは、作成したPHPファイルを実行します。

::

  $ php $your_plugin_dir/test/unit/model/MiniDiaryTableTest.php


テスト結果が表示されます。

::

  1..4
  ok 1 - MiniDiaryTable::getDiaryOrderByDateDesc() は Doctrine_Collection を返す
  ok 2 - MiniDiaryTable::getDiaryOrderByDateDesc() は 5件のデータを返す
  ok 3 - MiniDiaryTable::getDiaryOrderByDateDesc() は Doctrine_Collection を返す
  ok 4 - MiniDiaryTable::getDiaryOrderByDateDesc() は 1件のデータを返す
  # Looks like everything went fine.

Functional Test
===============

正常な表示や、アクセス制限が正常に行われているかを確認します。

``$your_plugin_dir/test/functional/pc_frontend/miniDiaryActions.php``

.. code-block:: php

  <?php

  include dirname(__FILE__).'/../../bootstrap/functional.php';

  $browser = new opTestFunctional(new sfBrowser(), new lime_test(9, new lime_output_color()));

  include dirname(__FILE__).'/../../bootstrap/database.php';

  // ログイン
  $browser->login('sns@example.com', 'password');

  // miniDiary/show

  $browser->
    info('miniDiary/:id')->
    // 通常アクセス
    get('miniDiary/1')->
    with('request')->begin()->
      isParameter('module', 'miniDiary')->
      isParameter('action', 'show')->
    end()->
    with('response')->begin()->
      isStatusCode(200)->
    end()->
    // フレンドの全員に公開のミニ日記
    get('miniDiary/2')->
    with('response')->begin()->
      isStatusCode(200)->
    end()->
    // フレンドのフレンドまで公開のミニ日記
    get('miniDiary/3')->
    with('response')->begin()->
      isStatusCode(200)->
    end()->
    // 他人の全員に公開のミニ日記
    get('miniDiary/4')->
    with('response')->begin()->
      isStatusCode(200)->
    end()->
    get('miniDiary/5')->
    with('response')->begin()->
      isStatusCode(404)->
    end()->
    // アクセスブロックされたメンバーへのアクセス
    get('miniDiary/6')->
    with('response')->begin()->
      isStatusCode(404)->
    end()->
    get('miniDiary/999')->
    with('response')->begin()->
      isStatusCode(404)->
    end();

テストを実行するときは、作成したPHPファイルを実行します。

::

  $ php $your_plugin_dir/test/functional/pc_frontend/miniDiaryActions.php


テスト結果が表示されます。

::

  1..9
  # post /member/login/authMode/MailAddress
  > miniDiary/:id
  # get miniDiary/1
  ok 1 - request parameter module is miniDiary
  ok 2 - request parameter action is show
  ok 3 - status code is 200
  # get miniDiary/2
  ok 4 - status code is 200
  # get miniDiary/3
  ok 5 - status code is 200
  # get miniDiary/4
  ok 6 - status code is 200
  # get miniDiary/5
  ok 7 - status code is 404
  # get miniDiary/6
  ok 8 - status code is 404
  # get miniDiary/999
  ok 9 - status code is 404
  # Looks like everything went fine.


脆弱性のテスト
--------------

OpenPNE3には、脆弱性が発生していないかということを自動テストで行うための機能を備えています。

.. warning::

  このテストは実装者が、基本的な脆弱性が発生していないかを確認するレベルのものです。
  以下の手法により、脆弱性が絶対に起きないということを保証するものではありません。

XSS
~~~

機能テスト中ではXSS脆弱性のチェックを以下のように行うことができます。

.. code-block:: php-inline


  $browser->
    get('miniDiary/7')->
    with('html_escape')->begin()->
      isAllEscapedData('Member', 'name')->
      isAllEscapedData('MiniDiary', 'body')->
    end();

このコードで、 ``Member`` のニックネームと、 ``MiniDiary`` の ``body`` が
エスケープされているかを確認することができます。

この時、テストデータの形式は指定されたものにする必要があります。

検査対象データは

::

  <&\"'>モデル名.カラム名 ESCAPING HTML TEST DATA"

という形式にしてください。

CSRF
~~~~

機能テスト中ではCSRF脆弱性のチェックを以下のように行うことができます。

.. code-block:: php-inline

  $browser->
    post('miniDiarye', array())->
    checkCSRF();

CSRFトークンがない状態で、日記作成アクションを実行しようとすると、
当然エラーが出るはずです。

``checkCSRF()`` はCSRFトークン不備によるエラーメッセージが出ているかを確認することができます。

また明日
========

明日は、テンプレート拡張を取り扱います。
