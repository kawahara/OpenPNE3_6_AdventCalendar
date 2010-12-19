=======================
19日目 メールを受信する
=======================

:Author: Shogo Kawahara <Twitter: @ooharabucyou>
:Date: 2010-12-19

OpenPNE3にはメールを受信する機能が備わっています。

今回は、メールを受信する機能を活用して、メールからの投稿を
受け付ける処理を記述しましょう。

スケルトンの作成
================

メールの受信についての処理は、 ``mobile_mail_frontend`` というアプリケーションで取り扱います。

``opGenerate:app`` タスクを利用して、プラグインに ``mobile_mail_frontend`` のスケルトンを作成しましょう。

::

  $ cd $openpne_dir
  $ php symfony opGenerate:app opSamplePlugin mobile_mail_frontend

``mobile_mail_frontend`` にモジュールのスケルトンも作成します。

::

  $ php symfony opGenerate::module opSamplePlugin mobile_mail_frontend miniDiary

アクション作成
==============

受信したメールを処理するためのアクションを作成します。

``mobile_mail_frontend`` アクションの ``miniDiary`` にアクションを記述します。

``$your_plugin_dir/apps/mobile_mail_frontend/modules/miniDiary/actions/actions.class.php``

.. code-block:: php

  <?php

  class miniDiaryActions extends sfActions
  {
    public function executeCreate(sfWebRequest $request)
    {
      $member = $this->getRoute()->getMember();
      if (!$member)
      {
        return sfView::NONE;
      }

      // $request->getMailMessage() でメールの本文を取得
      $mailMessage = $request->getMailMessage();

      $validator = new opValidatorString(array('rtrim' => true));
      try
      {
        $body = $validator->clean($mailMessage->getContent());
      }
      catch (Exception $e)
      {
        return sfView::NONE;
      }

      $miniDiary = new MiniDiary();
      $miniDiary->setBody($body0;
      $miniDiary->save();

      return sfView::NONE;
    }
  }


ルーティングルールの定義
========================

OpenPNE3は、メールアドレスを元に、どのアクションを利用するべきかを決定します。

この仕組みは、symfonyのルーティングを活用しています。
``routing.yml`` でメールアドレスのパターンとアクションを対応付けします。

``$your_plugin_dir/apps/mobile_mail_frontend/config/routing.yml``

::

  mail_mini_diary_create:
    url: mini.d                               # メールアドレスのパターン指定
    class: opMailRoute                        # classにはopMailRouteを指定してください。
    param: { module: miniDiary, action: create }  # アクションを指定します

リンクの埋込み
==============

``op_mail_to()`` ヘルパー関数を利用します。

.. code-block:: php

  <?php echo op_mail_to('mail_mini_diary_create', array(), 'メールから投稿') ?>

また明日
========

明日は、メンバーの設定変更の拡張について取り扱います。

.. この回は体調崩してだめだ...書きなおす
