====================
11日目 SNS情報の活用
====================

:Author: Shogo Kawahara <Twitter: @ooharabucyou>
:Date: 2010-12-11

アクション中で、SNSの情報をどの様に取得するかを学びます。

.. note:: 個人情報の取り扱いには細心の注意を払いましょう。

今日紹介するサンプルコードはアクションの中で利用します。

プロフィール情報
================

ニックネーム
------------

.. code-block:: php-inline

  // ログイン中の Member のインスタンスを取得
  $member = $this->getUser()->getMember();
  // ニックネームの取得
  $nickname = $member->getName();


年齢
----

年齢は、メンバーが公開範囲を選択することができます。

そのため、閲覧者と情報保持者が異なる場合の配慮をする必要があります。

.. code-block:: php-inline


  // member_id = 1 の Member のインスタンスを取得
  $member = Doctrine::getTable('Member')->find(1);

  // ログイン中の Member のインスターンスを取得
  $viewer = $this->getUser()->getMember();

  // $memberの年齢を取得
  // 第1引数を true にすることにより公開範囲のチェックを行います。
  // 第2引数に 閲覧者の member_id を渡します。
  // 閲覧者に権限がない場合や、対象のメンバーが生年月日を登録していない場合
  // false が返されます。
  $age = $member->getAge(true, $viewer->getId());


その他プロフィール
------------------

プロフィールも年齢と同様に公開範囲があるため、
閲覧者と情報保持者が異なることを考えなくてはなりません。

.. code-block:: php-inline

  // member_id = 1 の Member のインスタンスを取得
  $member = Doctrine::getTable('Member')->find(1);

  // ログイン中の Member のインスターンスを取得
  $viewer = $this->getUser()->getMember();

  // MemberProfile インスタンスの配列を取得
  // 第1引数を true にすることにより公開範囲のチェックを行います。
  // 第2引数に 閲覧者の member_id を渡します。
  $memberProfiles = $member->getProfiles(true, $viewer->getId());

プロフィール情報は、以下の情報を取得することができます。

.. code-block:: php-inline

  // プロフィール識別子の取得
  $name = $memberProfile->getName();

  // 値の取得
  $value = $memberProfile->getValue();

特定のプロフィール情報のみを取得する場合は、以下のように行うことができます。

.. code-block:: php-inline

  // member_id = 1 の Member のインスタンスを取得
  $member = Doctrine::getTable('Member')->find(1);

  // ログイン中の Member のインスターンスを取得
  $viewer = $this->getUser()->getMember();

  // プロフィール識別子から取得
  $memberProfile = $member->getProfile('op_preset_birthday');

  // MemberProfile に対して、 isViewable() に閲覧者の member_id
  // を渡すことにより、 が閲覧可能かどうかが boolean で返される
  $isViewable = $memberProfile->isViewable($viewer->getId()))


特定のメンバーのフレンド
========================

特定のメンバーのフレンドを取得する場合は、以下のように行うことができます。

.. code-block:: php-inline

  // member_id = 1 の Member のインスタンスを取得
  $member = Doctrine::getTable('Member')->find(1);

  // Member インスタンスの配列を取得
  // 第1引数に取得件数を指定できる (デフォルトは null で, nullで全て取得)
  $friends = $member->getFriends();

  // フレンド数の取得
  $numberFriends = $member->countFriends();


特定のメンバーのフレンドのIDのみを取得する場合は、以下のように行えます。

こちらのほうが、前者よりパフォーマンス的に優れています。

.. code-block:: php-inline

  // member_id = 1 の フレンド member_id の配列を取得
  $friendIds = Doctrine::getTable('MemberRelationShip')->getFriendMemberIds(1);

特定のメンバーのコミュニティ
============================

特定のメンバーの参加しているコミュニティを取得する場合は、以下のように行なえます。

.. code-block:: php-inline

  // member_id = 1 の 所属する Community インスタンス の配列を取得
  // 第1引数に id
  // 第2引数に取得件数を指定できる (デフォルトは5で, nullで全て取得)
  $communitys = Doctrine::getTable('Community')->retrievesByMemberId(1, null);

特定のメンバーの参加しているコミュニティIDのみを取得する場合は、以下のように行なえます。

こちらのほうが、前者よりパフォーマンス的に優れています。

.. code-block:: php-inline

  // member_id = 1 の 所属する community_id の配列を取得
  $communityIds = Doctrine::getTable('Community')->getIdsByMemberId(1);

特定のコミュニティの情報
========================

コミュニティのメンバー
----------------------

特定のコミュニティに参加しているメンバーの取得は以下のように行なえます。

.. code-block:: php-inline

  // community_id = 1 の Community のインスタンスを取得
  $community = Doctrine::getTable('Community')->find(1);

  // コミュニティ参加者の Memner インスタンスの配列を取得
  $members = $community->getMembers();

特定のコミュニティに参加しているメンバーのIDのみを取得する場合は、以下のように行えます。

.. code-block:: php-inline

  // member_id = 1 の コミュニティ参加者 member_id の配列を取得
  $memberIds = Doctrine::getTable('CommunityMember')->getMemberIdsByCommunityId(1);

また明日
========

明日は、モバイルについて取り扱います。
