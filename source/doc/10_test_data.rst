===============================
10日目 開発のためのデータを用意
===============================

:Author: Shogo Kawahara <Twitter: @ooharabucyou>
:Date: 2010-12-10

開発するプラグインによっては、フレンドを多く必要とするものがあるかもしれません。

そこで、メンバーやコミュニティを量産するプラグインが用意されています。

入手
====

::

  $ cd $openpne_dir/plugins
  $ git clone git://github.com/kawahara/opKdtPlugin.git
  $ cd ..
  $ php symfony cc

.. warning:: opKdtPlugin は開発のためのものです。運用環境に入れてはいけません。

利用法
======

いくつかの例を紹介します。

メンバーの追加
--------------

::

  $ php symfony opKdt:generate-member

ダミーのメンバーを10追加します。追加されたメンバーにはフレンドはいません。名前は dummy の語尾に ``member_id`` を付加したものになります。

メールアドレスはPC向け、モバイル向け共に sns ``$id`` @example.com になります。

パスワードは全て ``password`` で登録されています。

::

  $ php symfony opKdt:generate-member --link=1

ダミーのメンバーを10追加します。この際、 ``member_id`` が 1 のメンバーとフレンドリンクします。

::

  $ php symfony opKdt:generate-member --number=100

ダミーのメンバーを100追加します。

::

  $ php symfony opKdt:generate-member --name-format="foo%d"

ダミーのメンバーを10追加します。この際、名前は foo の語尾にIDを追加したものにします。

::

  $ php symfony opKdt:generate-member --mail-address-format="dummy%d@example.com"

ダミーのメンバーを10追加します。ダミーメンバーのメールアドレスは dummy ``$id`` @example.com にします。

::

  $ php symfony opKdt:generate-member --password-format="password%d"

ダミーのメンバーを10追加します。ダミーメンバーのパスワードは password の語尾に ``member_id`` を追加したものにします。

コミュニティの追加
------------------

::

  $ php symfony opKdt:generate-community

ダミーのコミュニティを10追加します。管理メンバーは ``member_id`` が 1のメンバーになります。カテゴリは、 ``地域`` になります。
名前は、dummyの語尾に ``community_id`` を追加したものになります。

::

  $ php symfony opKdt:generate-community --number=100

ダミーのコミュニティを100追加します。

::

  $ php symfony opKdt:generate-community --name-format="foo%d"

ダミーのコミュニティを10追加します。名前は、fooの語尾に ``community_id`` を追加したものになります。


::

  $ php symfony opKdt:generate-community --admin-member=2

ダミーのコミュニティを10追加します。管理メンバーは ``member_id`` が 2のメンバーになります。


::

  $ php symfony opKdt:generate-community --category=3

ダミーのコミュニティを10追加します。カテゴリは、 ``community_category_id`` が 3のものになります。

フレンドリンク
--------------

::

  $ php symfony opKdt:make-friend

全メンバーのフレンドを最大10増やします。フレンドになるメンバーはランダムです。


コミュニティメンバーの追加
--------------------------

::

  $ php symfony opKdt:join-community

全メンバーの所属コミュニティを最大10増やします。所属するコミュニティはランダムです。

::

  $ php symfony opKdt:join-member-to-community --community=2

``community_id`` が2 のコミュニティに強制的に全員参加させます。

また明日
========

これで、テストの為にわざわざテスト用のユーザに招待したり、フレンド申請を何度も行う手間は省けるようになりました。

明日は、アクションの中でSNSの情報を活用する方法を学びます。
