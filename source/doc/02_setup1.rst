=============
2日目 準備(1)
=============

:Author: Shogo Kawahara <Twitter: @ooharabucyou>
:Date: 2010-12-02

今日は、OpenPNE3の入手セットアップとその点で起きがちな問題を取り上げています。

このドキュメントは、今後のプラグイン開発向けに書かれていますので、実際に運用する場合は *$openpne_dir/doc/ja/OpenPNE3_Setup_Guide.txt* を読むようにしてください。

環境の準備
==========

OpenPNE3.6の動作および開発では以下の環境が必要です。

* Apache

  - mod_rewrite

* PHP

  - PHP5.2.3以降

    + mbstring拡張モジュール
    + XML拡張モジュール
    + PCRE拡張モジュール
    + PDO拡張モジュール (MySQLのドライバが必要です。)
    + JSON拡張モジュール
    + GDライブラリ
    + mcrypt (推奨)
    + APC拡張モジュール (推奨)

* データベースサーバ

  - MySQL4.1以降 (5.1以降を推奨)

また、本ドキュメントでは、OpenPNE3.6をgitを使い入手します。gitを準備しておいてください。

.. note::

  Debianでgitを導入する場合、以下のように導入できます。

  $ sudo apt-get install git-core

OpenPNE3本体の入手
==================

今回は、OpenPNE3 の gitレポジトリからソースコードを入手します。

::

  $ git clone git://github.com/openpne/OpenPNE3.git

カレントディレクトリに、OpenPNE3 というディレクトリでクローンされます。git checkout を使って、目的のバージョンのタグに切り替えましょう。

::

  $ cd OpenPNE3
  $ git checkout OpenPNE-3.6beta6

.. note::

  tagの一覧を観たいときは、git tag -l を使うと表示されます。

  $ git tag -l

  OpenPNE3.6に絞りたいときは grep と組み合わせましょう

  $ git tag -l | grep OpenPNE-3.6

ソースコードの入手ができました。

今後、新しいバージョンがリリースされたときは以下のように行うことができます。( *$openpne_dir* で操作してください)

::

  $ git pull --tag
  $ git checkout #新しいバージョン#

追加して、リリース情報に記載されたバージョンアップ方法も合わせてご利用下さい。

セットアップ
============

設定ファイルのコピー
--------------------

::

  $ cd $openpne_dir
  $ cp config/ProjectConfiguration.class.php.sample config/ProjectConfiguration.class.php
  $ cp config/OpenPNE.yml.sample config/OpenPNE.yml

*$openpne_dir/config/ProjectConfiguration.class.php* はsymfonyの動作させるために必要なもので、 *$openpne_dir/config/OpenPNE.yml* はOpenPNE3の設定 (管理画面から行えないもの) を行うためのものです。

.. warning::

  *$openpne_dir/config/OpenPNE.yml.sample* は **削除してはいけません** 。なぜならば、デフォルトの設定としてロードされるからです。

その後、OpenPNE.yml の設定値を実行環境に合わせて変更します。

特に、 **base_url** と **mail_domain** の値は、メール投稿・配信などで重要にある値のため正しく設定を行う必要があります。


例 ::

  ######################################
  # 基本設定 (Basic)
  ######################################

  # SNS の URL
  # URL of the SNS
  base_url: "http://sns.example.com"

  ######################################
  # メール (Mail)
  ######################################

  # SNS からのメール送信に使うドメイン
  # Domain to use for sending e-mail from the SNS
  mail_domain: "sns.example.com"

  # (以下省略)


バンドルプラグインの管理
------------------------

インストール時に、いくつかのプラグインは、 `OpenPNE3プラグインチャネルサーバ`_ からダウンロードされインストールされます。どの様なプラグインがインストールされるかどうかというのは https://trac.openpne.jp/svn/OpenPNE3/bandled-plugins-list/ で管理されています。

OpenPNE3.6beta6 ならばプラグインのリストは、 https://trac.openpne.jp/svn/OpenPNE3/bandled-plugins-list/3.6beta6.yml です。

もしも、運用上・開発上で不要なプラグインがある場合は *$openpne_dir/config/plugins.yml* を作成を記述して保存します。

::

  プラグイン名:
    install: false

例えば、opOpenSocialPlugin が不要というのならば、以下のようになります。

例::

  プラグイン名:
    install: false

.. _`OpenPNE3プラグインチャネルサーバ`: http://plugins.openpne.jp/

インストールコマンドの実行
--------------------------

以下のコマンドを実行して、インストールを実行します。

::

  $ php symfony openpne:intall

.. warning::

  このコマンドは、 **データベースの削除を行い、作り直します。** もしも、データベースの再作成について都合が悪いときは、 *$openpne_dir/doc/ja/OpenPNE3_Setup_Guide.txt* に記されている、オプションを付けたインストール方法を確認して下さい。

コマンドを実行すると、以下の事項の入力が求められます。

* DBMSの選択 (今回はmysqlを使用)
* データベース名
* データベース接続用ユーザー名
* データベース接続用パスワード (オプション)
* データベースサーバーのホスト名
* データベースサーバーのポート番号 (オプション)
* (サーバのホスト名に localhost を利用した場合) 使用するソケット名のパス (オプション)

インストールは自動的に行われます。

mod_rewrite の設定
------------------

*$openpne_dir/web/.htaccess* の RewriteBase を各自の環境に合わせて設定して下さい。URLの絶対パスを指定します。例えば、 *http://sns.example.com* に設置するのであれば以下のようになります。

::

  RewriteBase /

Apacheの設定(例)
----------------

実際に動かすために、Apacheの設定を変更します。

httpd.conf ファイルで以下のように設定します。

例 ::

  NameVirtualHost *:80

  <VirtualHost *:80>
    DocumentRoot "$openpne_dir"
    ServerName sns.example.com
    <Directory "$openpne_dir/web">
      AllowOverride All
      Allow from All
    </Directory>

    Alias /sf $openpne_dir/lib/vendor/symfony/data/web/sf
    <Directory "$openpne_dir/lib/vendor/symfony/data/web/sf">
      AllowOverride All
      Allow from All
    </Directory>
  </VirtualHost>

/sf というエイリアスは、symfonyのデバッグツールバーの画像やJavaScriptに利用されます。

アクセスとログイン
==================

ユーザ側
--------

*http://sns.example.com/index.php* にアクセスして、ログイン画面が表示されるかを確認しましょう。

メールアドレスを sns@example.com 、 パスワードを password を入力して、ログイン出来るかを確認してください。

管理画面
--------

*http://sns.example.com/pc_backend.php* にアクセスして、ログイン画面が表示されるかを確認しましょう。

ユーザ名を admin、パスワードを password と入力して、ログイン出来るかを確認してください。

.. warning::

  実際の運用時は、必ずメールアドレスやパスワードを変更してください。


また明日
========

明日は、プラグインのスケルトンを作成して、ディレクトリの構造や役割を見ていきます。
