<?php
/**
 * Whoops - php errors for cool kids
 * @author Filipe Dobreira <http://github.com/filp>
 */

namespace Whoops\Handler;

use Whoops\Exception\Inspector;
use Whoops\Run;
use Whoops\Util\Misc;

/**
 * Abstract implementation of a Handler.
 */
abstract class Handler implements HandlerInterface
{
    /**
     * Return constants that can be returned from Handler::handle
     * to message the handler walker.
     */
    const DONE         = 0x10; // returning this is optional, only exists for
                               // semantic purposes
    const LAST_HANDLER = 0x20;
    const QUIT         = 0x30;

    /**
     * @var Run
     */
    private $run;

    /**
     * @var Inspector $inspector
     */
    private $inspector;

    /**
     * @var \Throwable $exception
     */
    private $exception;

    /**
     * @var bool
     */
    private $canSendHeaders;

    /**
     * @param Run $run
     */
    public function setRun(Run $run)
    {
        $this->run = $run;
    }

    /**
     * @return Run
     */
    protected function getRun()
    {
        return $this->run;
    }

    /**
     * @param Inspector $inspector
     */
    public function setInspector(Inspector $inspector)
    {
        $this->inspector = $inspector;
    }

    /**
     * @return Inspector
     */
    protected function getInspector()
    {
        return $this->inspector;
    }

    /**
     * @param \Throwable $exception
     *
     * @deprecated
     */
    public function setException($exception)
    {
        $this->exception = $exception;
    }

    /**
     * Get the exception via the inspector.
     *
     * @return \Throwable
     *
     * @deprecated
     */
    protected function getException()
    {
        return $this->exception;
    }

    /**
     * Allows to disable all attempts to dynamically decide whether to
     * send headers.
     * Set this to false to ensure that the handler will not send headers.
     * @param  bool|null $value
     * @return bool
     */
    public function canSendHeaders($value = null)
    {
        if (func_num_args() == 0) {
            if ($this->canSendHeaders === null) {
                $this->canSendHeaders = Misc::canSendHeaders();
            }
            return $this->canSendHeaders;
        }

        $this->canSendHeaders = (bool) $value;
    }
}
