=======================
13日目 マイグレーション
=======================

:Author: Shogo Kawahara <Twitter: @ooharabucyou>
:Date: 2010-12-13

あなたは、プラグインをある程度完成させて、実運用環境で動かし始めました。
しかし、機能を追加するためにデータベースモデルを変更する必要性が出てしまいました。

データベースモデルを変更するには、Doctrineの **マイグレーション** 機能を使います。

データベースモデルの変更計画
============================

ミニ日記に、公開範囲を追加しようと考えました。

そのためには、ミニ日記のモデルに公開範囲を表すカラムが必要になるでしょう。
(実装は明日行います。)

``mini_diary`` テーブルに、 ``public_flag`` というカラムを追加することにしました。

schema.ymlの修正
================

:doc:`06_database1` で行った、データベースモデル定義を変更します。

``$your_plugin_dir/config/doctrine/schema.yml`` の一部

::

  MiniDiary:
    actAs: [Timestampable]
    columns:
      member_id:   { type: integer(4), notnull: true }
      body:        { type: string, notnull: true }
      public_flag: { type: integer(1), notnull: true, default: 0 } # この行を追加
    relations:
      Member: { foreign: id, onDelete: cascade }


スクリプトの作成
================

``$your_plugin_dir/data/migrations/`` にマイグレートのためのスクリプトを用意します。

OpenPNE3では、ファイル名を元にマイグレートを行ったかを判断します。
以下のようなファイル名である必要があります。

``リビジョン番号_マイグレート名.php``

リビジョン番号は、2桁で順番につけます。

今回は、始めてのスクリプトなので 01 となります。


``$your_plugin_dir/data/migrations/`` ディレクトリを作成し、以下のファイルを追加します。

``$your_plugin_dir/data/migrations/01_add_column_mini_diary.php``

.. code-block:: php

  <?php

  // クラス名は他のクラスや、マイグレートと被らないものにすること
  class opSamplePlugin01AddColumnMiniDiary extends Doctrine_Migration_Base
  {
    // バージョンアップ時のスクリプト
    public function up()
    {
      // mini_diary に public_flag というカラムを追加
      // 1bit の integer型
      // notnull
      $this->addColumn('mini_diary', 'public_flag', 'integer', '1', array(
        'notnull' => '1',
        'default' => '0',
      ));
    }

    // バージョンダウン時のスクリプト
    public function down()
    {
      $this->removeColumn('mini_diary', 'public_flag');
    }
  }

.. note::

  マイグレーションに関する詳しい情報は、以下を確認してください。

  * `Doctrine - Doctrine ORM for PHP - Migrations <http://www.doctrine-project.org/projects/orm/1.2/docs/manual/migrations/ja>`_

初期データの作成
================

今後、初期セットアップを行うときは、 ``01_add_column_mini_diary.php`` での
バージョンアップが完了した状態になります。

リビジョンの管理は、 ``sns_config`` で行っています。
``name`` カラムには ``プラグイン名_revision`` 。 ``value`` カラムにはリビジョン番号を登録して管理しています。

そのため、セットアップ時に挿入される初期データとして、
リビジョン番号を登録するようにしましょう。

初期データは ``$your_plugin_dir/data/fixtures/`` YAML ファイルで定義します。

``$your_plugin_dir/data/fixtures/00_revision.yml``

::

  SnsConfig:
    op_sample_current_revision:
      name:  "opSamplePlugin_revision"
      value: 1

.. note::

  fixtures に関する詳しい情報は、以下を確認して下さい。

  * `Doctrine - Doctrine ORM for PHP - Data Fixtures <http://www.doctrine-project.org/projects/orm/1.2/docs/manual/data-fixtures/ja>`_


マイグレートの実行
==================

マイグレートの実行は以下のように行うことができます。

.. note::  失敗に備えてデータベースのバックアップを取っておいてください。

::

  $ cd $openpne_dir
  $ symfony openpne:migrate
  $ symfony cc

これで、 ``mini_diary`` テーブルに ``public_flag`` が追加されます。

.. openpne:migrate のオプションに関する説明を行いたい
  また、マイグレートスクリプトの自動生成についてを述べるべきだろう

また明日
========

明日は、データのプライバシーコントロールについて取り扱います。
