==============================
7日目 データベースモデルの活用
==============================

:Author: Shogo Kawahara <Twitter: @ooharabucyou>
:Date: 2010-12-07

データの操作は、Doctrineが生成したモデルを活用します。

.. note:: 関連する symfony のドキュメント

  * `A Gentle Introduction to symfony | 第8章 モデルレイヤーの内側 <http://www.symfony-project.org/gentle-introduction/1_4/ja/08-Inside-the-Model-Layer>`_

オブジェクトクラスとテーブルクラス
==================================

Doctrineはビルド時にオブジェクトクラスとテーブルクラスの2つのクラスを作成します。

オブジェクトクラスは、1つのレコードを表現しています。

テーブルクラスは、テーブルからデータを取得するメソッドなどを提供しています。

昨日作成した、 ``mini_diary``, ``mini_diary_comment`` はそれぞれ ``MiniDiary``, ``MiniDiaryComment`` クラスに対応しています。

データを追加
============

データの追加は、以下の用に行うことができます。(以下のコードはアクション中で行う事を想定)
オブジェクトをッ新規作成し、 ``save()`` メソッドを利用します。

.. code-block:: php-inline

  $miniDiary = new MiniDiary();

  // データをセットセットしていきます。
  $miniDiary->setMemberId(1);
  $miniDiary->setBody("Hello, world");

  // 保存
  $MiniDiary->save();

``created_at``, ``updated_at`` は自動的に最適な値が保存されます。また、 ``member_id`` の設定は以下のように行うこともできます。

.. code-block:: php-inline

  $member = $this->getUser()->getMember();

  $miniDiary->setMember($member);

ログイン中は、 ``$this->getUser()->getMember()`` で 現在ログイン中の ``Member`` インスタンスを返します。

昨日作成したYAMLファイルでは、リレーションを設定しているため、 ``$miniDiary`` に対して、 ``Member`` のインスタンスを渡すことができます。

.. warning::

  通常、ユーザの入力値を保存するときは、symfony のFormプラットフォームを利用します。

  理由は、CSRF脆弱性を防ぐためでもあります。

  CSRF (Cross Site Request Forgeries) 脆弱性についての詳しい情報は、
  OpenPNE3セキュアコーディングガイドラインの説明を読んでください。

  * `OpenPNE3 セキュアコーディングガイドライン - CSRF (Cross Site Request Forgeries) 脆弱性 <http://www.openpne.jp/developer/secure-coding-guideline/#csrf-cross-site-request-forgeries>`_

  (このドキュメントは 2010-12-07 現在、作成中の状態です。)

  Formプラットフォームの利用は後に説明します。

データの取得
============

データを検索して取得するときは、テーブルクラスを使います。


.. code-block:: php-inline

  Doctrine::getTable('MiniDiary');

で、 ``MiniDiary`` のテーブルクラスの取得ができます。

主キーから検索する場合は簡単です。 ``find()`` を使いましょう。

.. code-block:: php-inline

  // id = 1 のデータを1件取得
  $miniDiary = Doctrine::getTable('MiniDiary')->find(1);

  // カラムの取得
  $id = $miniDiary->getId();     // $id === 1
  $body = $miniDiary->getBody();

特定のカラムから、検索する場合は以下のようになります。

``findByXXXX()`` (XXXXはカラム名) メソッドを利用すると、特定のカラムについて条件をつけて検索することができます。

.. code-block:: php-inline

  // member_id = 1 の複数のデータを取得
  $miniDiaries = Doctrine::getTable('MiniDiary')->findByMemberId(1);

  foreach ($miniDiaries as $miniDiary)
  {
    // ..
  }

``findByXxxxAndYyyyy()`` (Xxxx と Yyyy は共にカラム名) メソッドを使うと、2つの条件を重ねあわせた検索ができます。

もっと複雑な条件や、並び替えなどを利用するときは ``Doctrine_Query`` を利用します。

.. code-block:: php-inline

  // updated_at の逆順で検索するQuery作成
  $query = Doctrine::getTable('MiniDiary')->createQuery()
    ->orderBy('updated_at DESC');

  // Query実行
  $miniDiaries = $query->execute();

  foreach ($miniDiaries as $miniDiary)
  {
    // ..
  }

データの更新
============

更新は、既存のオブジェクトを ``save()`` します。

.. code-block:: php-inline

  // id = 1 のデータを1件取得
  $miniDiary = Doctrine::getTable('MiniDiary')->find(1);

  // 値を変更
  $miniDiary->setBody('Hello?');

  // 更新
  $miniDiary->save();

保存時には、 ``created_at`` の値は変更されませんが、 ``updated_at`` は保存時刻に変更されます。

データの削除
============

削除は、既存のオブジェクトに対して ``delete()`` をします。

.. code-block:: php-inline

  // id = 1 のデータを1件取得
  $miniDiary = Doctrine::getTable('MiniDiary')->find(1);

  // 削除
  $miniDiary->delete();


アクションをシンプルにするために
================================

アクションはなるべく簡素に書きましょう。

データベースからデータを取得するときはアクションに検索クエリなどを長々と記さずに、
オブジェクトクラスやテーブルクラスに自前のメソッドを追加して、それを使うのがいいでしょう。

プラグインの場合、 ``$your_plugin_dir/lib/model/`` に作られたクラスを編集することにより、
メソッドの追加が可能です。ここに作られるクラスは ``Plugin`` という接頭語が付いた抽象クラスで、
実際には継承されたクラスが使われます。テーブルクラスについては、 ``Table`` というサフィックスがつけられてます。

例として、 ``mini_diary`` から ``updated_at`` の降順で、指定件数のデータを取得するというメソッドをテーブルクラスに追加します。

``$your_plugin_dir/lib/model/doctrine/PluginMiniDiaryTable.class.php``

.. code-block:: php

  <?php

  class PluginMiniDiaryTable extends Doctrine_Table
  {
    // 一部省略..

    public function getDiaryOrderByDateDesc($limit = 5)
    {
      $q = $this->createQuery()
        ->orderBy('updated_at DESC')
        ->limit($limit);

      return $q->execute();
    }
  }

.. code-block:: php-inline

  // 最大5件で、updated_at の逆順でデータを取得
  $miniDiaries = Doctrine::getTable('MiniDiary')->getDiaryOrderByDateDesc();

また明日
========

明日はルーティングについて学びます。
