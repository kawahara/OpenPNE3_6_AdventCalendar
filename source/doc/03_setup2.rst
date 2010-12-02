=============
3日目 準備(2)
=============

:Author: Shogo Kawahara <Twitter: @ooharabucyou>
:Date: 2010-12-03

いよいよ、実際にプラグインの骨格を作ります。

プラグインスケルトンの作成
==========================

OpenPNE3には、プラグインスケルトン(骨格)を作成する機能が備わっています。

以下のコマンドで、スケルトンの作成ができます。

::

  $ cd $openpne_dir
  $ php symfony opGenerate:plugin プラグイン名

OpenPNE3のプラグイン名には規則があり、opXXXXPlugin (XXXXは任意の文字列)である必要があります。他のプラグインと同じ名前を付けることはできません。

.. note::

  通常のプラグイン以外に、特殊な役割を持つプラグインが2つ存在します。

  * スキンプラグイン
  * 認証プラグイン

  **スキンプラグイン** は、opSkinXXXXPlugin (XXXXは任意の文字列) という名前です。デザインやレイアウトを変更する用途に利用します。複数のスキンプラグインから1つのみ選ぶことができます。デフォルトでは、opSkinBasicPlugin と opSkinClassicPlugin がインストールされ、 opSkinBasicPlugin が有効になっています。opSkinClassicPlugin は、OpenPNE2のデザイン

  **認証プラグイン** は、opAuthXXXXPlugin (XXXXは任意の文字列) という名前です。ログインフォームと認証方法を提供するためのものです。

このドキュメントでは、opSamplePluginという名前のプラグインを使います。

::

  $ php symfony opGenerate:plugin opSamplePlugin

*$openpne_dir/plugins/opSamplePlugin* というディレクトリが作成されます。今後、このドキュメントでは、このディレクトリを *$your_plugin_dir* と表記します。


アプリケーションディレクトリの作成
----------------------------------

OpenPNE3.6 には、5つのアプリケーションが用意されています。それぞれが設定や表示で異なる挙動をします。

pc_frontend
  ユーザ側のPC用アプリケーションです。
mobile_frontend
  ユーザ側のモバイル用アプリケーションです。文字コードや絵文字に関わる処理が追加されます。
pc_backend
  管理画面用アプリケーションです。
api
  API用のアプリケーションです。
mobile_mail_frontend
  メール投稿を受けるける処理などを行うためのアプリケーションです。

まずは ユーザ側PC向けのページを作りたいので、プラグインに pc_frontend のディレクトリを作成します。

これもコマンドによって簡単に行うことができます。

::

  $ php symfony opGenerate:app プラグイン名 アプリケーション名

opSamplePlugin で pc_frontend のディレクトリを作りたいので以下のようになるでしょう。

::

  $ php symfony opGenerate:app opSamplePlugin pc_frontend

モジュールの作成
----------------

モジュールは、複数のアクション・ページをまとめるものです。以下のコマンドで作成ができます。

::

  $ php symfony opGenerate:module プラグイン名 アプリケーション名 モジュール名

opSamplePlugin の pc_frontend で sample モジュールを作りたいので以下のようになるでしょう。

::

  $ php symfony opGenerate:module opSamplePlugin pc_frontend sample

ディレクトリの役割
==================

これまでに作られたプラグインのディレクトリを確認してみましょう。

::

  $your_plugin_dir/
  |-- apps/
  |   `-- pc_frontend
  |       `-- modules
  |           `-- sample
  |               |-- actions
  |               |   `-- actions.class.php
  |               `-- templates
  |                   `-- indexSuccess.php
  |-- dependencies.yml.sample
  |-- lib/
  `-- test/

apps/
  アプリケーションが格納されるディレクトリで。
apps/pc_frontend/
  opGenerate:app で作成された、pc_frontendのディレクトリです。
apps/\*/modules
  モジュールが格納されるディレクトリです。
apps/\*/modules/\*/actions/
  アクションを格納します。
apps/\*/mobile/\*/templates/
  テンプレートを格納します。
dependencies.yml.sample
  プラグインの依存関係を定義するファイルの **サンプル** です。このファイルが無くてもプラグインは動作します。
lib/
  プラグイン独自のクラスをこのディレクトリに追加していきます。オートロードの対象です。
test/
  テスト用のコードを追加します。まだ気にする必要はありません。

TIPS: symfonyプラグインとの違い
===============================

.. note::

  この項は、symfony の Plugin を理解している人の為の説明です。今後に支障は出ないので、読み飛ばしても構いません。

OpenPNE3のプラグインは、symfonyのプラグインの機能を活用していますが、挙動は異なります。

プラグイン名に制約がある
  上にも挙げたとおり、OpenPNE3のプラグインは opXXXXPlugin である必要があります。
*apps/* がある。
  symfonyプラグインでアクションやビューを実装する場合は、プラグイン直下に *modules/* を設置して、 *setting.yml* でプラグインのモジュールを有効にする必要があります。

  OpenPNE3プラグインの場合は、アプリケーションのディレクトリを作成し、その中にモジュールを持つ仕組みになっています。モジュールを有効にする時に特別な設定は不要です。
ProjectConfiguration::enablePlugins() を行う必要はない。
  OpenPNE3のプラグインは *$openpne_dir/plugins/* に設置すればデフォルトで有効になります。もしも、特定のプラグインを無効にしたい場合は、管理画面 > プラグイン設定をから設定を行うことができます。

また明日
========

準備を終えました！明日は、ページを作ります。
