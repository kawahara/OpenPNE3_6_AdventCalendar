==============
1日目 はじめに
==============

:Author: Shogo Kawahara <Twitter: @ooharabucyou>
:Date: 2010-12-01


これは `OpenPNE <http://www.openpne.jp>`_ 3.6 のプラグイン作成に関する知識をまとめるものです。2010年12月1日から24日まで1章ずつ文章化していく、アドベントカレンダー形式です。

OpenPNEとはオープンソースのSNSエンジンです。OpenPNE3ではフレンド機能・コミュニティ機能を核として、プラグインによって日記・コミュニティトピック・OpenSocialなど様々な機能を提供することができます。OpenPNE3.6は、symfony1.4 (Doctrine1.2) をベースに開発されています。このドキュメントを読む前に、symfonyのドキュメントである `A Gentle Introduction to symfony`_ を読んでおくと理解がしやすいかもしれません。

.. _`A Gentle Introduction to symfony`: http://www.symfony-project.org/gentle-introduction/1_4/ja/

プラグインができること
======================

OpenPNE3のプラグインは以下のことができます。

* OpenPNE3のユーザ情報・コミュニティ情報を活用する。
* ガジェット機能によってホームやプロフィールに任意の情報を表示させる。
* データベースモデルを定義する。
* あらゆるアクションの前後で独自の動作を行うようにする。

OpenPNE3本体をカスタマイズしなくても、SNSに独自の機能を実装することができるという事を目指しています。

ドキュメント中の表記について
============================

このドキュメントでは以下の表記を使います。

*$openpne_dir*
  OpenPNE3を設置したディレクトリを指します。もしもあなたが、 */home/foo/OpenPNE3* にOpenPNE3を設置したのならば、 */home/foo/OpenPNE3/lib* は *$openpne_dir/lib/* と表記します。

*$your_plugin_dir*
  後にもっと詳しく説明しますが、プラグインは *$openpne_dir/plugins* 下に opXXXXPlugin(XXXXは任意の名前) というディレクトリ設置することになっています。このドキュメントでは、あなたが作成しているプラグインのディレクトリをこの表記で説明します。 *$openpne_dir/plugins/opXXXXPugin/lib* は *$your_plugins_dir/lib* と表記します。

*http://sns.example.com*
  OpenPNE3が設置され、実際に動作を確認することができるURLを示します。

明日以降アドベントカレンダーで取り扱うこと
=========================================

* セットアップ & プラグインスケルトンの作成
* ページ作成
* ガジェット作成
* データベースモデル作成
* 携帯対応
* マイグレーション
