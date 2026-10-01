<x-errors.page
    :code="401"
    :title="__('Sign in required')"
    :heading="__('A key is required')"
    :message="__('This page is only available after you sign in.')"
    :action-label="Route::has('login') ? __('Sign in') : __('Go home')"
    :action-url="Route::has('login') ? route('login') : url('/')"
    :secondary-label="Route::has('login') ? __('Go home') : null"
    :secondary-url="url('/')"
/>
