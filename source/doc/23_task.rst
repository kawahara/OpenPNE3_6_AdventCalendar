=============
23日目 タスク
=============

:Author: Shogo Kawahara <Twitter: @ooharabucyou>
:Date: 2010-12-23

プラグインによっては、cronなどを利用して定期的にスクリプトを実行しなくては
ならない場合があるかと思います。

そのような場合、 symfony のタスク機能を利用して、 OpenPNE3 に新しいタスクを追加しましょう。

.. note:: 関連する symfony のドキュメント

  * `The More with symfony book | コマンドラインとタスクの活用 <http://www.symfony-project.org/more-with-symfony/1_4/ja/13-Leveraging-the-Power-of-the-Command-Line>`_


タスクとは
==========

タスクとは、コマンドライン上で symfony のスクリプトを実行するための機能です。
今日まで、プラグインのスケルトンの作成や、キャッシュの削除などで使ってきました。

以下で、利用出来るタスク一覧を出力することができます。

::

  $ cd $openpne_dir
  $ php symfony -T

OpenPNE3 本体では、 symfony が用意しているタスクに加えて
インストールタスクや、バージョン表示タスクなどを備えています。

タスクの追加はプラグインでも行うことができます。

:doc:`10_test_data` で利用した *opKdtPlugin* はテストデータ挿入用の
タスクを追加するためのプラグインといえます。

タスクの追加
============

``$your_plugin_dir/lib/task`` に独自のタスククラスを追加することにより、
タスクの追加を行うことができます。

クラスの名前は xxxxTask (xxxxは任意の文字列) という名前になるようにしてください。

最もシンプルな例は以下のようになります。

``$your_plugin_dir/lib/task/opSampleTask.class.php``

.. code-block:: php

  <?php

  // DBへの接続を行わない場合は 継承元が sfBaseTask でも良い
  class opSampleTask extends sfBaseTask
  {
    // タスク名の定義などを configure() に行う
    protected function configure()
    {
      // 名前空間 (分類)
      $this->namespace = 'opSample';
      // タスク名
      $this->name      = 'sample';
    }

    // 実際のタスクの処理を execute() 記述する
    protected function execute($arguments = array(), $options = array())
    {
      // Hello と出力する
      $this->log("Hello");
    }
  }

実行してみましょう。

::

  $ cd $openpne_dir
  $ php symfony opSample:sample
  Hello

オプションとパラメータ
----------------------

タスクで受け取りたいパラメータとオプションは
``configure()`` で定義します。

``$your_plugin_dir/lib/task/opSampleTask.class.php``

.. code-block:: php

  <?php

  class opSampleTask extends sfBaseTask
  {
    protected function configure()
    {
      $this->namespace = 'opSample';
      $this->name      = 'sample';

      // パラメータ定義 arg1 という名前
      $this->addArgument('arg1', sfCommandArgument::REQUIRED, 'argument 1', null);

      // パラメータ定義 arg2 という名前 (オプション)
      $this->addArgument('arg2', sfCommandArgument::OPTIONAL, 'argument 2', 'default');

      // オプション定義 option1 という名前でパラメータ必須
      $this->addOption('option1', null, sfCommandOption::PARAMETER_REQUIRED, 'option 1', 'default');

      // オプション定義 option2 という名前でパラメータなし
      $this->addOption('option2', null, sfCommandOption::PARAMETER_NONE, 'option 2', null);

      // オプション定義 option3 という名前でパラメータはあってもなくてもよい
      $this->addOption('option3', null, sfCommandOption::PARAMETER_OPTIONAL, 'option 3', null);
    }

    protected function execute($arguments = array(), $options = array())
    {
      $this->log($arguments['arg1']);
      $this->log($arguments['arg2']);

      $this->log($options['option1']);
      $this->log($options['option2']);
      $this->log($options['option3']);
    }
  }

実行してみましょう。

::

  $ cd $openpne_dir
  $ php symfony opSample:sample hello
  hello
  default
  default


  $ php symfony opSample:sample --option1=hello hello
  hello
  default
  hello


  $ php symfony opSample:sample --option1=hello --option2 hello world
  hello
  world
  hello
  1

データベース
------------

データベースを利用する場合には、symfony アプリケーションや環境の設定が
行われる必要があるため、特別なオプションである ``application`` と ``evn``
を定義します。

.. code-block:: php

  <?php

  class opSampleTask extends sfBaseTask
  {
    protected function configure()
    {
      $this->namespace = 'opSample';
      $this->name      = 'sample';

      $this->addOption('application', null, sfCommandOption::PARAMETER_REQUIRED, 'The application name', true);
      $this->addOption('env', null, sfCommandOption::PARAMETER_REQUIRED, 'The environment', 'dev');
    }

    protected function execute($arguments = array(), $options = array())
    {
      // sfDatabaseManager のインスタンス化
      new sfDatabaseManager($this->configuration);

      // 以下 Doctrine を使うことができる
      $member = Doctrine::getTable('Member')->find(1);
      // member_id=1 のメンバーの名前を出力
      $this->log($member->getName());
    }
  }

実行してみます。

::

  $ cd $openpne_dir
  $ php symfony opSample:sample
  OpenPNE君

タスクの定期実行 (cron)
=======================

定期的にメールを送信したり、SNS内の情報を定期的に取得したりするような場合
にはタスクを定期実行するのがよいでしょう。

cron を利用する場合、以下のように設定を行います。

2時間ごとに ``opSample:sample`` タスクを定期実行する場合の例

::

  00 */2 * * * cd $openpne_dir && /path/to/php $openpne_dir/symfony opSample:sample

``/path/to/php`` は php のパスを指定してください。
