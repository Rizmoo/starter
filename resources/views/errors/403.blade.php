<x-errors.page
    :code="403"
    :title="__('Access denied')"
    :heading="__('This gate stays shut')"
    :message="__('You do not have permission to view this page.')"
    :action-label="__('Go home')"
    :action-url="url('/')"
/>
