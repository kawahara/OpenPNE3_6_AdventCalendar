=====================
21日目 アクティビティ
=====================

:Author: Shogo Kawahara <Twitter: @ooharabucyou>
:Date: 2010-12-21

SNS内での活動履歴であるアクティビティの取得・投稿について取り扱います。


アクティビティ
==============

アクティビティ機能は、SNS内での活動履歴やユーザ自身の投稿を
取り扱うものです。

アクティビティの情報に対する操作は、 ``ActivityDataTable`` を通して行います。

取得
----

.. code-block:: php-inline

  // member_id = 1 の最近のアクティビティを5件取得
  $activities = Doctrine::getTable('ActivityData')->getActivityList(1);

  foreach ($activities as $activity)
  {
    // アクティビティ本文取得
    $body = $activity->getBody();
  }


``getActivityList()`` は以下の仕様です。

* 第1引数には取得対象の member_id を渡します。
* 第2引数には閲覧者の member_id を渡します。 (デフォルトはログイン中のIDで省略可能)
* 第3引数には件数を指定します。 (デフォルトは5で、省略可能)

投稿
----

.. code-block:: php-inline


  // member_id = 1 で "Hello" というアクティビティを投稿
  Doctrine::getTable('ActivityData')->updateActivity(1, "Hello");

``updateActivity()`` は以下の仕様です。

* 第1引数には投稿対象の member_id を渡します。
* 第2引数には本文を渡します。 (140字以内)
* 第3引数にはオプションを配列で渡します。

  - public_flag: 公開範囲です。以下の公開範囲を指定することができます。

    + ActivityDataTable::PUBLIC_FLAG_SNS : SNS内まで公開 (デフォルト)
    + ActivityDataTable::PUBLIC_FLAG_FRIEND : フレンドまで公開
    + ActivityDataTable::PUBLIC_FLAG_PRIVATE : 本人のみ公開
